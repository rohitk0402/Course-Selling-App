import express from "express";
import { buyCourse, courseDetails, createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller.js";
import userMiddleware from "../middleware/user.mid.js";
import adminMiddleware from "../middleware/admin.mid.js";

const router=express.Router()

router.post("/create",adminMiddleware,createCourse)
router.put("/update/:courseId",adminMiddleware,updateCourse)
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)

router.get("/courses",getCourses)
router.get("/:courseId",courseDetails)

router.post("/buy/:courseId",userMiddleware,buyCourse)


export default router;