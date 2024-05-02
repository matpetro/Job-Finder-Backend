const PORT = process.env.PORT || 8002
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const crypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// needed just for local testing
const cors = require('cors');
app.use(cors());

app.use(express.json());

const mongoUrl="mongodb+srv://petromathew:UDrZF8u2wrDj4pXI@cluster0.tff38w0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl).then(() => {
    console.log("Database Connected");
}).catch((e)=>{
    console.log(e);
});

require("./UserDetails")

// get all the previous entries in this model
const User = mongoose.model("UserInfo");

// get for the data confirmation
app.get("/", (req, res) => {
    res.send({status:"Started"});
})

// post for adding a new user
app.post('/register', async(req, res) => {
    const {name, profession, email, username, password, image} = req.body;
    // check that user does not already have an account
    const oldEmail = await User.findOne({email:email});
    const oldUsername = await User.findOne({username:username});

    if (oldUsername) {
        return res.send({status: "error", msg: "Username already in use!"});
    } else if (oldEmail){
        return res.send({status: "error", msg: "Email already in use!"});
    }
    const encryptedPass = await crypt.hash(password, 10);

    try {
        await User.create({
            name:name,
            profession:profession,
            email:email,
            username:username,
            password:encryptedPass,
            profilePic: image
        });
        res.send({status:"ok", msg:"User Created"});
    } catch (error) {
        res.send({status:"error", msg:error})
    }
});

app.post("/login-user", async(req, res) => {
    const {username, password} = req.body;
    const existingUser = await User.findOne({username : username});

    if (!existingUser){
        return res.send({msg: "User does not exist"});
    }

    if (await crypt.compare(password, existingUser.password)){
        const token = jwt.sign({username: existingUser.username}, JWT_SECRET);
        if (res.status(201)){
            return res.send({status:"login successful", token: token})
        } else {
            return res.send({error:"error logging in: Invalid info"})
        }
    }
})

app.post("/get-user-data", async(req, res) => {
    const {token} = req.body;
    try {
        // verify the token that the user sent is valid
        const user = jwt.verify(token, JWT_SECRET);
        User.findOne({username: user.username}).then(data => {
            return res.send({status:"User Verified", data: data})
        })

    } catch (error) {
        return res.send({error:"Error logging in: Invalid Token"})
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))