import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors'
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js"
import adminRoute from "./routes/admin.route.js"
import orderRoute from "./routes/order.route.js"
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}))

app.use(cors(
  {
    origin:https://course-selling-app-2-6vt3.onrender.com ,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    allowedHeader:["Context-Type","Authorization"],
  
  }
))

// Database Connection
const DB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/v1/course", courseRoute); 
app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/order",orderRoute)


//cloundinary configration 
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key:process.env.api_key, 
  api_secret: process.env.api_secret ,
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});