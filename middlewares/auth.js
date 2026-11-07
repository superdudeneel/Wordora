const {createTokenForUser, validateToken} = require("../services/auth");
const userModel = require("../models/user");

async function checkAuthentication(req, res, next){
    res.locals.currentPath = req.path;
    const token = req.cookies?.uid;
    if(!token){
        return next();
    }
    const user = validateToken(token);

    const dbUser = await userModel.findOne({
        _id: user._id
    })
    if(!dbUser){
        return next();
    }

    req.user = dbUser;
    res.locals.user = dbUser; 

    return next();
}

function restrictTo(roles = []){
    return (req, res, next) => {
        if(!req.user){
            return res.redirect("/login");
        }
        if(!roles.includes(req.user.role)){
            return res.end("Unauthorized resource");
        }
    }
}

module.exports = {checkAuthentication, restrictTo};