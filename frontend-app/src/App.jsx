import React from 'react'
import { Route,Routes } from "react-router-dom"
import Home from  "./componenets/Home";
import Login from './componenets/Login';
import Signup from './componenets/Signup';
import Course from './componenets/course';
import Buy from './componenets/Buy';
import Purchase from './componenets/purchase';
import {Toaster} from 'react-hot-toast';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import CourseCreate from './admin/CourseCreate';
import DashBorad from './admin/DashBorad';
import UpdateCourse from './admin/UpdateCourse';
import OurCourse from './admin/OurCourse';
import { Navigate } from 'react-router-dom';

function App() {
  const user=JSON.parse(localStorage.getItem("user"))
  const admin=JSON.parse(localStorage.getItem("admin"))

  return (
    <div>
      <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>


      {/* some other routes */}
      <Route path="/courses" element={<Course/>}/>
      <Route path="/buy/:courseId" element={<Buy/>}/>
      <Route path="/purchases" element={user?<Purchase/>:<Navigate to={"/login"}/>}/>

      {/* admin routes */}
      <Route path="/admin/signup" element={<AdminSignup/>}/>
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/admin/create-course" element={<CourseCreate/>}/>
      <Route path="/admin/dashboard" element={admin?<DashBorad/>:<Navigate to={"admin/login"}/>}/>
      <Route path="/admin/update-course/:id" element={<UpdateCourse/>}/>
      <Route path="/admin/our-course" element={<OurCourse/>}/>
      

      
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
 