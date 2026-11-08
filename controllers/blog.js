const blogModel = require("../models/blog");
const userModel = require("../models/user");
const commentModel = require("../models/comment");
const likeModel = require("../models/like");
const collectionModel = require("../models/collection");

async function handleCreateBlog(req, res){
    const {title, category, body} = req.body;

    if(!title || !body || !category){
        return res.status(400).json({
            msg: "All fields required"
        })
    }

    try{
        const blog = await blogModel.create({
            title: title,
            body: body,
            coverImageUrl: req.file ? `/data/${req.file.filename}` : undefined,
            category: category,
            createdBy: req.user?._id
        })
        return res.redirect("/");
    }catch(err){
        console.log("Some error occured", err);
        return res.render("addBlog", {
            error: "Some error occured while publishing a blog"
        })
    }
}

async function handleGetBlogById(req, res){
    const id = req.params.id;

    const blog = await blogModel.findById(id).populate("createdBy");
    const comments = await commentModel.find({blogId: id}).populate("createdBy");
    const likes = await likeModel.find({blogId: id}).populate("createdBy");
    const collections = await collectionModel.find({
        createdBy: req.user?._id
    }).populate("createdBy");

    if (!blog) {
        return res.json({
            msg: "No such blog found. Pls give the correct id",
        });
    }

    let saved = "false";
    let liked = "false";
    
    if(req.user){
        const userLiked = await likeModel.findOne({
            blogId: id,
            createdBy: req.user._id
        })
        if(userLiked){
            liked = "true";
        }
    }

    if (req.user) {
        const dbUser = await userModel.findById(req.user._id);
        if(dbUser.savedBlogs.includes(id)){
            saved = "true";
        }else{
            saved = "false";
        }
    }

    return res.render("readBlog", {
        user: req.user,
        blog: blog,
        saved: saved,
        comments: comments,
        likes: likes,
        liked: liked,
        collections: collections
    });
}

async function handleSaveBlog(req, res){
    const user = req.user;
    const id = req.params.id;

    const blogToBeSaved = await blogModel.findById(id);
    
    try{
        const userToBeUpdated = await userModel.findOne({
            _id: user._id
        })
        const idx = userToBeUpdated.savedBlogs.findIndex((b) => b.toString() === id);
        if(idx === -1){
            userToBeUpdated.savedBlogs.push(id);
        }else{
            userToBeUpdated.savedBlogs.splice(idx, 1);
        }
        
        await userToBeUpdated.save();
        return res.json({
            success: true
        });
    }catch(err){
        console.error(err);
        return res.json({
            msg: "Some error occured"
        })
    }
    
}

async function handleCommentOnBlog(req, res) {
    const { comment } = req.body;
    const blogId = req.params.id;
    const user = req.user;

    if (!blogId) {
        return res.status(404).json({ msg: "blog not found" });
    }
    if (!user) {
        return res.redirect("/login");
    }
    if (!comment || !comment.trim()) {
        return res.redirect(`/blog/${blogId}`);
    }

    try {
        const newComment = await commentModel.create({
            content: comment.trim(),
            blogId: blogId,
            createdBy: user._id
        });
        return res.redirect(`/blog/${blogId}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Some error occured" });
    }
}

async function handleLikePost(req, res) {
    if (!req.user) {
      return res.redirect("/login");
    }
  
    const blogId = req.params.id;
    const userId = req.user._id;
  
    try {
      const existing = await likeModel.findOne({ blogId, createdBy: userId });
  
      let liked;
      if (existing) {
        await likeModel.deleteOne({ _id: existing._id });
        liked = false;
      } else {
        await likeModel.create({ blogId, createdBy: userId });
        liked = true;
      }
  
      const count = await likeModel.countDocuments({ blogId });
  
      return res.json({ liked, count });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Couldn't update like" });
    }
}

module.exports = {handleCreateBlog, handleGetBlogById, handleSaveBlog, handleCommentOnBlog, handleLikePost};