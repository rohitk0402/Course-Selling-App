import { User } from "../models/user.models.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import {z} from "zod";
import config from "../config.js";
import {Purchase} from "../models/purchase.model.js"
import { Course } from "../models/course.models.js";




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
    const existingUser=await User.findOne({email:email});

  if(existingUser){
    return res.status(400).json({errors:"User already exists"});
  }
  const newUser=new User({firstName,lastName,email,password:hashedpassword})
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
      const user=await User.findOne({email:email});
      const isPasswordCorrect=await bcrypt.compare(password,user.password)

      if(!user || !isPasswordCorrect){
        return res.status(403).json({errors:"Invalid credentials"});
      }

      //jwt code 
      const token=jwt.sign(
      {
        id:user._id,
      },
      config.JWT_USER_PASSWORD,
      {expiresIn:"1d"}
    );
      const cookieOptions={
        expires:new Date(Date.now()+24+60*60*1000),
        httpOnly:true,  //can't be accsed via js directly
        secure:process.env.NODE_ENV==="production",// ture for https only
        sameSite:"Strict" //CSRF attacks

      }

      res.cookie("jwt",token,cookieOptions);
      res.status(201).json({message:"Login successful",user,token});

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

export const purchase = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ errors: "Unauthorized access" });
  }

  try {
    const purchased = await Purchase.find({ userId });

    const purchaseCourseId = purchased.map(p => p.courseId);

    const courseData = await Course.find({
      _id: { $in: purchaseCourseId }
    });

    res.status(200).json({ purchased, courseData });

  } catch (error) {
    res.status(500).json({ errors: "Error in purchases" });
    console.log("Error in purchase", error);
  }
};





