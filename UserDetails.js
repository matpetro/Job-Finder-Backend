// scheme of data

const mongoose = require("mongoose");

const UserDetailSchema = new mongoose.Schema({
    name: String,
    profession: String,
    email: {type: String, unique: true},
    username: {type: String, unique: true},
    password: String,
    profilePic: String
},{
    collection:"UserInfo"
});

mongoose.model("UserInfo", UserDetailSchema)