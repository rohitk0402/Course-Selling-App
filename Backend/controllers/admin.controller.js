
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import {z} from "zod";
import config from "../config.js";

import { Admin } from "../models/admin.models.js";




export const signup=async(req,res)=>{
  const {firstName,lastName,email,password}=req.body;


  const userSchema=z.object({
    firstName:z.string().min(3,{message:"Firstname must be atleast 3 char long"}),
    lastName:z.string().min(3,{message:"LastName must be atleast 3 char long"}),
    email:z.string().email(),
    password:z.string().min(6,{message:"Password must be atleast 6 char long"}),
  })
   
  const validateData=userSchema.safeParse(req.body);
  if(!validateData.success){
    return res.status(400)
    .json({errors:validateData.error.issues.map((err)=>err.message)})
  }
  const hashedpassword=await bcrypt.hash(password,10)

  try{
    const existingUser=await Admin.findOne({email:email});

  if(existingUser){
    return res.status(400).json({errors:"User already exists"});
  }
  const newUser=new Admin({firstName,lastName,email,password:hashedpassword})
  await newUser.save();
  res.status(201).json({message:"Signup succeeded ",newUser})

  }
  catch(error){
    res.status(500).json({error:"Error in signup"});
    console.log("Error is signup",error);

  }

}


export const login =async(req,res)=>{
   const {email,password}=req.body;

    try{
      const admin=await Admin.findOne({email:email});
      const isPasswordCorrect=await bcrypt.compare(password,admin.password)

      if(!admin || !isPasswordCorrect){
        return res.status(403).json({errors:"Invalid credentials"});
      }

      //jwt code 
      const token=jwt.sign(
      {
        id:admin._id,
      },
      config.JWT_ADMIN_PASSWORD,
      {expiresIn:"1d"}
    );
      const cookieOptions={
        expires:new Date(Date.now()+24+60*60*1000),
        httpOnly:true,  //can't be accsed via js directly
        secure:process.env.NODE_ENV==="production",// ture for https only
        sameSite:"Strict" //CSRF attacks

      }

      res.cookie("jwt",token,cookieOptions);
      res.status(201).json({message:"Login successful",admin,token});

    }catch(error){
      res.status(500).json({error:"Error in login"});
      console.log("Error in login",error);
    }
}


export const logout=async(req,res)=>{
  try{
    if(!req.cookies.jwt){
      return  res.status(401).json({errors:"kindly login first"})
    }
    res.clearCookie("jwt");
    res.status(200).json({message:"Logged out successfully"});
  }catch(error){
    res.status(500).json({errors:"error in logout"});
    console.log("error in logout",error);
  }
};