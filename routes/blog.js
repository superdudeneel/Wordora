const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require('crypto')

const {handleCreateBlog, handleGetBlogById, handleSaveBlog, handleCommentOnBlog, handleLikePost} = require("../controllers/blog");
const { compareSync } = require("bcrypt");
const blogModel = require("../models/blog");

const router = express.Router();

// multer config to save files on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/data/`))
  },
  filename: function (req, file, cb) {
    filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
})

const upload = multer({ storage: storage })

// routes
router.get("/add-new", (req, res)=>{
    if(!req.user){
        return res.redirect("/login");
    }
    return res.render("addBlog", {
        user: req.user
    });
})
router.post("/add-new", upload.single("imageUrl"), handleCreateBlog);
router.get("/:id", handleGetBlogById);
router.post("/save/:id", handleSaveBlog);
router.post("/comment/:id", handleCommentOnBlog);
router.post("/like/:id", handleLikePost);

module.exports = router;