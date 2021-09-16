const jwt=require('jsonwebtoken')
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
require('dotenv').config()

const {API_SECRET,API_KEY,CLOUD_NAME} =require("../config")


cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret:API_SECRET
  });
  const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	folder: "profilepics",
	allowedFormats: ["jpg", "png"],
	transformation: [{ width: 500, height: 500, crop: "limit" }]
  });
  
exports.upload = multer({ storage: storage });


exports.requireSignin =(req,res,next)=>{
    if(req.headers.authorization){
        const token =req.headers.authorization.split(" ")[1]
        const user = jwt.verify(token,process.env.SECRET_KEY)
        req.user=user
    }
    else{ 
        return res.status(400).json({message:"Authorization required"})
    }
    next()
    // jwt.decode(token,)
}
exports.userMiddleware =(req,res,next)=>{
    if(req.user.role !== "user"){
        res.status(400).json({
            message:"User Access denied"
        })
    }
    next()
}
exports.adminMiddleware =(req,res,next)=>{
    if(req.user.role !== "admin"){
        res.status(400).json({
            message:"Admin Access denied"
        })
    }
    next()
}
exports.superAdminMiddleware =(req,res,next)=>{
    if(req.user.role !== "superadmin"){
        res.status(400).json({
            message:"Super Admin Access denied"
        })
    }
    next()
}