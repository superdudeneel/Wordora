const express = require("express");

const {handleGetUserProfile, handleFollowProfile, handleUnfollowProfile} = require("../controllers/profile");

const router = express.Router();

// routes
router.get("/:id", handleGetUserProfile);
router.post("/follow/:id", handleFollowProfile);
router.post("/unfollow/:id", handleUnfollowProfile);

module.exports = router;