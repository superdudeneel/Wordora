const mongoose = require("mongoose");
const {createHmac, randomBytes} = require("crypto");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImageUrl: {
        type: String,
        default: "/images/default.png"
    },
    bio: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    password: {
        type: String,
        required: true
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    savedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    }],
    likedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    }]
}, {timestamps: true}
)

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;