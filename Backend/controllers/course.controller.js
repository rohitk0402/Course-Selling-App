import { response } from "express";
import { Course } from "../models/course.models.js";
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from "../models/purchase.model.js";


export const createCourse = async (req, res) => {
    
  const adminId=req.adminId


  const { title, description, price } = req.body;
  console.log(title, description, price);

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No file uploaded" });
    }

    const { image } = req.files;

    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({ errors: "Invalid file format. Only PNG and JPG are allowed" });
    }

    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res.status(400)
      .json({ errors: "Error uploading file to Cloudinary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId:adminId
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const updateCourse=async (req,res)=>{
  const adminId=req.adminId;

  const {courseId}=req.params;
  const {title,description,price,image}=req.body;

  try{
    const couseSearch=await Course.findById(courseId);
    if(!couseSearch){
      return res.status(404).json({error:"Course not found"});
    }
   const course=await Course.findOneAndUpdate(
    {
      _id:courseId,
      creatorId:adminId,
   },{
    title,
    description,
    price,
    image:{
      public_id:image?.public_id,
      url:image?.url,
    }
   }
  );
  if(!course){
    return res.status(404).Json({error:"Can,t update,created by other admin"})
  }

   res.status(201).json({message:"Course updated successfully",course})
  }catch(error){
    res.status(500).json({error:"Error is course updating"})
    console.log("Error is course updating",error)
  }

}

export const deleteCourse=async(req,res)=>{
  const adminID=req.adminId
  const {courseId}=req.params;

  try{
     const course=await Course.findOneAndDelete({
      _id:courseId,
      creatorId:adminID
     })
     if(!course){
      return res.status(404).json({error:"Can't delete,created by other admin"})
     }
     res.status(200).json({message:"Course deleted successfully"})
  }
  catch(error){
    res.status(500).json({errors:"Error in course deleting"})
    console.log("error in course deleting",error)

  }
}


export const getCourses=async(req,res)=>{
  try{
      const courses=await Course.find({})
      res.status(201).json({courses})
  }catch(error){
    res.status(500).json({error:" Error in getting courses"});
    console.log("error to get courses",error);
  }
};

export const courseDetails=async(req,res)=>{
    const {courseId}=req.params;
    try{
     const course=await Course.findById(courseId);
     if(!course){
       return res.status(404).json({error:"Course not found"})
     }
     res.status(200).json({course});
    }catch(error){
      res.status(500).json({error:"Error is getting course details"});
      console.log("Error is course details",error);
    }
}


import  { Stripe } from 'stripe'
import config from "../config.js"
const stripe=new Stripe(config.STRIPE_SECRET_KEY)

export const buyCourse=async(req,res)=>{
   

  const {userId}=req;
  const {courseId}=req.params;
  // console.log(userId);
  // console.log(courseId)
  try{
     const course=await Course.findById(courseId);
    //  console.log(course)
    
     if(!course){
      return res.status(404)
      .json({error:"Course not found"});
     }
     const existingPurchase=await Purchase.findOne({userId,courseId})
     if(existingPurchase){
      return res.status(400).json({error:"User has already purchased this course"});
     }
     //Stripe payment code goes here;
     const amount=course.price;
    //  console.log(amount)
     const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types:["card"]

    });
      // console.log("idhar aa gua")
     
     await course.save();
     res.status(201).json({
      message:"Course purchased successfully ",
      course,
      clientSecret:paymentIntent.client_secret
    });
  }catch(error){
    console.log("no purchase")
    res.status(500).json({errors:"Error in course buying"});
    console.log("error is course buying",error)

  }

}