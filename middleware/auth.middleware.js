const jwt = require("jsonwebtoken");
const authModel = require("../model/auth.model");

//this middleware is use for the verify the user identity based on token
//1.if token available in req.cookies so it is going to verify else give error
async function authUser(req,res,next){
   const {token}=req.cookies;

   if(!token){
     return res.status(401).json({
        message:"unauthorized"
    })
   }

   try{
    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    const user = await authModel.findById(decoded.id);
    req.user = user;
    next()
   }catch(err){
    res.status(401).json({
        message:"Unauthorized"
    })
   }
}

module.exports ={
    authUser
}