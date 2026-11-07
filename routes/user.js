const express = require("express");

const {handleLogIn, handleUserSignUp, 
    handleGetLibraryPosts, handleGetLibrarySaved, handleGetMyProfile, handleGetLibraryCollections
, handleCreateCollection} = require("../controllers/user");
 
// models    
const blogModel = require("../models/blog");
const userModel = require("../models/user");

const router = express.Router();

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
router.get("/myprofile", handleGetMyProfile);

module.exports = router;