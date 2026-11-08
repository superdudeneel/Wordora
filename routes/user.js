const express = require("express");
const multer = require("multer");
const path = require("path");

const {handleLogIn, handleUserSignUp, 
    handleGetLibraryPosts, handleGetLibrarySaved, handleGetMyProfile, handleGetLibraryCollections
, handleCreateCollection, handleAddBio, handleUploadProfilePic, handleAddToCollection} = require("../controllers/user");
 
// models    
const blogModel = require("../models/blog");
const userModel = require("../models/user");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/profile/`))
    },
    filename: function (req, file, cb) {
      filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
})

const upload = multer({storage: storage});

// routes
router.get("/signup", (req, res)=>{
    return res.render("signup");
})
router.get("/login", (req, res)=>{
    if(req.user){
        return res.redirect("/");
    }
    return res.render("login");
})
router.get("/logout", (req, res)=>{
    res.clearCookie("uid").redirect("/");
})
router.post("/signup", handleUserSignUp);
router.post("/login", handleLogIn);
router.get("/library/saved", handleGetLibrarySaved);
router.get("/library/myposts", handleGetLibraryPosts);
router.get("/library/collections", handleGetLibraryCollections);
router.post("/library/collections", handleCreateCollection);
router.post("/library/collections/:id", handleAddToCollection);
router.get("/myprofile", handleGetMyProfile);
router.post("/myprofile/add-bio", handleAddBio);
router.post("/myprofile/add-dp", upload.single("profileImage"), handleUploadProfilePic);

module.exports = router;