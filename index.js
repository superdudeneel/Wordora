const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const {checkAuthentication, restrictTo} = require("./middlewares/auth");
const blogModel = require("./models/blog");

// routers
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const profileRouter = require("./routes/profile");

const connectDB = require("./db/db");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
  });

// spawing up mongo db
connectDB()
    .then(()=>{
        console.log("Mongo DB connected");
    })
    .catch((err)=>{
        console.error(err);
    })

// views configuration
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// built in middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")))

// custom middleware for auth check
app.use(checkAuthentication);

app.use("/", userRouter);
app.use("/blog", blogRouter);
app.use("/profile", profileRouter);

app.get("/", async (req, res)=>{
    const allBlogs = await blogModel.find({}).populate("createdBy").sort({createdAt: -1});
    return res.render("home", {
        user: req.user,
        allBlogs: allBlogs
    });
})

// spawing up the server
app.listen(PORT, ()=>{
    console.log("Server has started");
})