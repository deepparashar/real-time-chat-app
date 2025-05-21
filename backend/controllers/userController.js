import { generateToken } from "../config/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import cloudinary from '../config/cloudinary.js'

//Function for register user

export async function register (req,res){
    const {fullName, email, password, bio} = req.body
   
    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success:false, message:'Missing Credentials'})
        }

        const user = await User.findOne({email})

        if(user){
            return res.json({success:false, message:'User already exists'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName, email, password:hashedpassword, bio
        })

        const token = generateToken(newUser)

        res.json({success:true, userData:newUser, token, message:"User Created"})
    } catch (error) {
        res.json({success:false, message:error.message})
        console.log(error.message)
    }
}

//Function for login user

export async function login (req,res) {
  const {email, password} = req.body;

  if(!email || !password){
    return res.json({success:false, message:"Invalid Credentials"})
  }

  try {
    const userData = await User.findOne({email})

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isCorrectPassword = await bcrypt.compare(password, userData.password)

    if (!isCorrectPassword) {
      return res.status(404).json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(userData._id)

    res.json({success:true, userData,token, message:"Login successfully"})
  } catch (error) {
    console.log(error.message)
    res.json({success:false, message:error.message})
  }
}

//controller for user authentication

export function checkAuth (req,res) {
    res.json({success:  true, user: req.user})
}

//Function for update profile

export async function updateProfile (req,res) {
  try {
     const {profilePic, bio, fullName} = req.body;

     const userId = req.user._id
     let updateUser;

     if(!profilePic){
      updateProfile = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true});
     } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      updateUser = await User.findByIdAndUpdate(userId, {profilePic:upload.secure_url, bio, fullName}, {new:true})
    }
     res.json({success:true, user: updateUser})
    
  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}

//Function for logout the user

export async function logout (req,res) {
    try {


        
    } catch (error) {
        res.json({success:true, message:error.message})
    }
}