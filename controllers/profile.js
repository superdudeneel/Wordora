const mongoose = require("mongoose");
const blogModel = require("../models/blog");
const userModel = require("../models/user");

function wantsJson(req) {
    const accept = req.get("Accept") || "";
    return accept.includes("application/json");
}

function respondFollow(req, res, profileId, following) {
    if (wantsJson(req)) {
        return res.json({ following: following });
    }
    return res.redirect("/profile/" + profileId);
}

async function handleGetUserProfile(req, res) {
    try {
        if (!req.user) {
            return res.redirect("/login");
        }
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).render("viewProfile", {
                user: req.user,
                profileUser: null,
                blogs: [],
                following: false
            });
        }

        const userProfile = await userModel.findById(id).lean();
        if (!userProfile) {
            return res.status(404).render("viewProfile", {
                user: req.user,
                profileUser: null,
                blogs: [],
                following: false
            });
        }

        const blogs = await blogModel.find({ createdBy: id }).lean();
        const viewer = await userModel.findById(req.user._id).select("following").lean();
        const following = !!(viewer && viewer.following.some(function (followedId) {
            return String(followedId) === String(id);
        }));

        return res.render("viewProfile", {
            user: req.user,
            profileUser: userProfile,
            blogs: blogs,
            following: following
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong");
    }
}

async function handleFollowProfile(req, res) {
    try {
        if (!req.user) {
            if (wantsJson(req)) return res.status(401).json({ msg: "Log in to follow" });
            return res.redirect("/login");
        }
        const profileId = req.params.id;
        if (!mongoose.isValidObjectId(profileId)) {
            return res.status(400).json({ msg: "That profile can’t be followed" });
        }
        if (String(req.user._id) === String(profileId)) {
            return res.status(400).json({ msg: "You can’t follow yourself" });
        }

        const profileUser = await userModel.findById(profileId).select("_id");
        if (!profileUser) {
            return res.status(404).json({ msg: "No such user profile found" });
        }

        await userModel.updateOne(
            { _id: req.user._id },
            { $addToSet: { following: profileId } }
        );
        await userModel.updateOne(
            { _id: profileId },
            { $addToSet: { followers: req.user._id } }
        );

        return respondFollow(req, res, profileId, true);
    } catch (err) {
        console.error(err);
        if (wantsJson(req)) return res.status(500).json({ msg: "Couldn’t follow this writer" });
        return res.status(500).send("Something went wrong");
    }
}

async function handleUnfollowProfile(req, res) {
    try {
        if (!req.user) {
            if (wantsJson(req)) return res.status(401).json({ msg: "Log in to unfollow" });
            return res.redirect("/login");
        }
        const profileId = req.params.id;
        if (!mongoose.isValidObjectId(profileId)) {
            return res.status(400).json({ msg: "That profile can’t be unfollowed" });
        }

        const profileUser = await userModel.findById(profileId).select("_id");
        if (!profileUser) {
            return res.status(404).json({ msg: "No such user profile found" });
        }

        await userModel.updateOne(
            { _id: req.user._id },
            { $pull: { following: profileId } }
        );
        await userModel.updateOne(
            { _id: profileId },
            { $pull: { followers: req.user._id } }
        );

        return respondFollow(req, res, profileId, false);
    } catch (err) {
        console.error(err);
        if (wantsJson(req)) return res.status(500).json({ msg: "Couldn’t unfollow this writer" });
        return res.status(500).send("Something went wrong");
    }
}

module.exports = { handleGetUserProfile, handleFollowProfile, handleUnfollowProfile };