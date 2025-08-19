import express from "express";
import {login, logout, purchase, signup} from "../controllers/user.controller.js"
import userMiddleware from "../middleware/user.mid.js"; 
import {  } from "../controllers/user.controller.js";

const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.get("/purchases",userMiddleware,purchase)



export default router;