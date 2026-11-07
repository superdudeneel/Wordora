const mongoose = require("mongoose");

function connectDB(){
    return mongoose.connect("mongodb://127.0.0.1:27017/blog-application");
}

module.exports = connectDB;