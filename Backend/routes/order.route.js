import express from "express";
import { orderdata } from "../controllers/order.conroller.js";
import userMiddleware from "../middleware/user.mid.js";
const router=express.Router();


router.post("/",userMiddleware,orderdata)


export default router;