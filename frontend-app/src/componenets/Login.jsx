import React, { useState } from 'react'
import logo from "../../public/logo.webp"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios' 
import toast from 'react-hot-toast'
import { BACKEND_URL } from '../utils/utils'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        {
         
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("login successful", response.data);
      toast.success("login successfully");
      localStorage.setItem("user",JSON.stringify(response.data))
      navigate("/");
  
    } catch (error) {
      console.error("login error:", error);
      if (error.response) {
        setErrorMessage("login failed");
        alert(error.response.data.errors);
      }
    }
  };

  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
      <div className='h-screen container mx-auto flex items-center justify-center text-white'>
        {/* Header */}
        <header className='absolute top-0 left-0 w-full flex justify-between items-center p-5'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="logo" className='w-10 h-10 rounded-full' />
            <Link to="/" className='text-xl font-bold text-orange-500'>CourseHaven</Link>
          </div>
          <div className='flex items-center space-x-3'>
            <Link to="/Signup" className='bg-transparent border border-gray-500 py-2 px-4 rounded-md'>SignUp</Link>
            <Link to="/courses" className='bg-orange-500 py-2 px-4 rounded-md'>Join now</Link>
          </div>
        </header>

        {/* Signup Form */}
        <div className='bg-gray-900 p-6 rounded-lg shadow-lg w-[500px] mt-10'>
          <h2 className='text-2xl font-bold mb-2 text-center'>Welcome to <span className='text-orange-500'>CourseHaven</span></h2>
          <p className='text-center text-gray-400 mb-4'>Login in to access paid content!</p>

          <form onSubmit={handleSubmit}>
           

           
            <div className='mb-3'>
              <label htmlFor="email" className='text-gray-400'>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Type your Email'
              />
            </div>

            <div className='mb-3'>
              <label htmlFor="password" className='text-gray-400'>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-3 rounded-md bg-gray-800 border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='**********'
                required
              />
            </div>

            <button type='submit' className='w-full bg-orange-500 hover:bg-blue-500 duration-500 text-white py-3 px-4 rounded-md transition'>Signup</button>
            {errorMessage && <p className='text-red-500 text-center mt-2'>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;