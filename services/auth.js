const jwt = require("jsonwebtoken");

const secret = "WJKJJFRI%789ic"

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    savedBlogs: user.savedBlogs,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl
  }
  const token = jwt.sign(payload, secret);
  return token
}

function validateToken(token){
  if(!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
      console.log("JWT verification failed:", error.message);
      return null;
  }
}

module.exports = {
  createTokenForUser,
  validateToken
};