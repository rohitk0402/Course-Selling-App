
import {Order} from "../models/order.model.js"
import { Purchase } from "../models/purchase.model.js";

export const  orderdata=async(req,res)=>{

  const order=req.body;
  try{
     const orderInfo=Order.create(order)
     console.log(orderInfo)
     const userId=orderInfo?.userId;
     console.log("dfhjdghj",userId)
     const courseId=orderInfo?.courseId;

     res.status(201).json({message:"order details",orderInfo})
   console.log(userId);
     if(orderInfo){
      await Purchase.create({userId,courseId});
      
     }
  }catch(error){
     console.log("Error in order",error)
     res.status(401).json({error:"Error in order creation"})

  }
} 
