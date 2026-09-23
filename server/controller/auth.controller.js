const authModel = require("../model/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs");

async function registerController(req,res){
    
    const {fullName:{firstName,lastName},email,password}  =req.body;

    const isUserExist = await authModel.findOne({
        email
    });
    if(isUserExist){
       return  res.status(400).json({
            message:"User already exists"
        })
    }
     
    const hashedPassword = await bcrypt.hash(password,10);

    const user = await authModel.create({
        fullName:{
            firstName,lastName
        },
        email,
        password: hashedPassword
    })

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.cookie("token",token);

    res.status(201).json({
     message:"user registered successfully",

    user,token
    })
}

async function loginController (req,res){
  const {email,password}=req.body;

  const user = await authModel.findOne({
   email
  })
   
  if(!user){
    return res.status(400).json({
        message:"Invalid email and password"
    })
  }

  const isPasswordValid = await bcrypt.compare(password,user.password);
  if(!isPasswordValid){
    return res.status(400).json({
        message:"Invalid password"
    })
  }

  const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
  res.cookie("token",token);

  res.status(200).json({
    message:"user logged in successfully",
    user
  })

}

module.exports={
    registerController,
    loginController
}