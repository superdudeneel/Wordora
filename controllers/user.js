const userModel = require("../models/user");
const blogModel = require("../models/blog");
const collectionModel = require("../models/collection");
const bcrypt = require("bcrypt");
const { randomBytes, createHmac } = require("crypto");
const {createTokenForUser, validateToken} = require("../services/auth");

async function handleUserSignUp(req, res){
    const {username, email, password} = req.body;

    if(!email || !username || !password){
        return res.status(400).json({
            msg: "All fields required"
        })
    }

    const existingUser = await userModel.findOne({
        email: email
    })
    if(existingUser){
        return res.json({
            msg: "email already registered"
        })
    }

    try{
        await userModel.create({
            username,
            email,
            password
        })
        return res.status(201).redirect("/login");
    }catch(err){
        console.error(err);
        return res.json({
            msg: "Some error occured"
        })
    }
}

async function handleLogIn(req, res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            msg: "All fields required"
        })
    }

    const user = await userModel.findOne({
        email: email,
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = createTokenForUser(user);
    res.cookie("uid", token);

    return res.redirect("/");
}

async function handleGetLibraryPosts(req, res){
    if(!req.user){
        return res.redirect("/login");
    }
    const dbUser = await userModel.findById(req.user._id);
    const myBlogs = await blogModel.find({
        createdBy: req.user._id
    }).populate("createdBy");

    return res.render("library", {
        user: req.user,
        blogs: myBlogs,
    })
}

async function handleGetLibrarySaved(req, res){
    if(!req.user){
        return res.redirect("/login");
    }
    const dbUser = await userModel.findById(req.user._id).populate({
        path: "savedBlogs",
        populate: { path: "createdBy" }
    });
    const blogs = (dbUser && dbUser.savedBlogs ? dbUser.savedBlogs : []).filter(Boolean).slice().reverse();
    return res.render("library", {
        user: req.user,
        blogs
    });
}

async function handleGetMyProfile(req, res){
    if(!req.user){
        return res.redirect("/login");
    }
    const user = req.user;
    const myBlogs = await blogModel.find({
        createdBy: user._id
    })

    return res.render("viewProfile", {
        user: req.user,
        profileUser: req.user,
        blogs: myBlogs,
    })
}

async function handleGetLibraryCollections(req, res){
    if(!req.user){
        return res.redirect("/login");
    }

    const allCollections = await collectionModel.find({
        createdBy: req.user?._id
    });

    return res.render("library", {
        user: req.user,
        collections: allCollections
    });
}

async function handleCreateCollection(req, res){
    if(!req.user){
        return res.redirect("/login");
    }

    const {name, description} = req.body;
    if(!name || !description){
        return res.json({
            msg: "Both the fields are required"
        })
    }

    try{
        await collectionModel.create({
            name: name,
            description: description,
            createdBy: req.user?._id
        })
        return res.redirect("/library/collections")
    }catch(err){
        console.error(err);
        return res.json({
            msg: "Some error occured"
        })
    }
}

module.exports = {handleLogIn, handleUserSignUp, handleGetLibraryPosts, handleGetLibrarySaved, handleGetMyProfile, handleGetLibraryCollections, handleCreateCollection};