import React, { useEffect, useState } from 'react';
import logo from "../../public/logo.webp";
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { BACKEND_URL } from '../utils/utils';

function Home() {
  const navigate = useNavigate(); 
  const [courses, setCourse] = useState([]);
  const [isloggedIn, setisloggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user");
    setisloggedIn(!!token); 
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true
      });
      toast.success(response.data.message);
      localStorage.removeItem("user"); 
      setisloggedIn(false);
      navigate("/"); 
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true
        });
        setCourse(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourse", error);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
      <div className='min-h-screen text-white container mx-auto'>
        {/* header */}
        <header className='flex items-center justify-between p-6'>
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="" className='w-10 h-10 rounded-full' />
            <h1 className='text-2xl text-orange-500 font-bold '>CourseHaven</h1>
          </div>
          <div className='space-x-4 '>
            {isloggedIn ? (
              <button
                onClick={handleLogout}
                className='bg-transparent text-white border border-white rounded py-1 px-4'>
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className='bg-transparent text-white border border-white rounded py-1 px-4'>
                  Login
                </Link>
                <Link
                  to="/signup"
                  className='bg-transparent text-white border border-white rounded py-1 px-4'>
                  Signup
                </Link>
                <Link
                  to="/admin/signup"
                  className='bg-transparent text-white border border-white rounded py-1 px-4'>
                  For Admin
                </Link>
              </>
            )}
          </div>
        </header>

        {/* main section */}
        <section className='text-center'>
          <h1 className='text-4xl text-orange-500 font-semibold'>CourseHaven</h1>
          <br />
          <p className='text-gray-500'>Sharpen your skills with crafted by experts</p>
          <div className='space-x-4 mt-8'>
            <Link to={"/courses"} className='bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explore courses</Link>
            <Link to={"https://youtu.be/ITUFHqvQCiE?si=AGcMFdiA6RWArklP"} className='bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white'>Course videos</Link>
          </div>
        </section>

        {/* course list */}
        <section className='mt-8'>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className='p-4'>
                <div className='relative flex-shrink-0 w-70 transition-transform duration-300 transform hover:scale-105'>
                  <div className='bg-gray-800 rounded-lg overflow-hidden'>
                    <img className='h-30 w-full object-contain' src={course.image?.url} alt="" />
                    <div className='p-5 text-center'>
                      <h2 className='text-xl text-white'>{course.description}</h2>
                      <Link to={"/courses"} className='mt-6 bg-orange-500 text-white py-1 px-4 rounded-full hover:bg-blue-400'>Enroll Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />

        {/* footer */}
        <footer className='bg-gradient-to-r from-black to-blue-950'>
          <div className='grid grid-cols-1 md:grid-cols-3 '>
            <div className='flex flex-col items-center '>
              <div className='flex items-center space-x-2'>
                <img src={logo} alt="" className='w-5 h-5 rounded-full' />
                <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven</h1>
              </div>
              <div className='mt-1 ml-2 md:ml-2 '>
                <p className='mb-2'>Follow us</p>
                <div className='flex space-x-4'>
                  <a href="#"><FaFacebook className=' text-2xl hover:text-blue-400 duration-300' /></a>
                  <a href="#"><FaInstagram className='text-2xl hover:text-pink-600 duration-300' /></a>
                  <a href="#"><FaTwitter className='text-2xl hover:text-blue-600 duration-300' /></a>
                </div>
              </div>
            </div>

            <div className='item-center flex flex-col'>
              <h3 className='text-lg font-semibold mb-2'>Connects</h3>
              <ul className='space-y-1 text-gray-400'>
                <li className='hover:text-white cursor-pointer duration-300 '>Youtube-learn Coding</li>
                <li className='hover:text-white cursor-pointer duration-300 '>Telegram -learn Coding</li>
                <li className='hover:text-white cursor-pointer duration-300 '>Github learn Coding</li>
              </ul>
            </div>

            <div className='item-center flex flex-col'>
              <h3 className='text-lg font-semibold mb-2'>&#169; 2025</h3>
              <ul className='space-y-1 text-gray-400'>
                <li className='hover:text-white cursor-pointer duration-300 '>Term & Conditions</li>
                <li className='hover:text-white cursor-pointer duration-300 '>Privacy Policy</li>
                <li className='hover:text-white cursor-pointer duration-300 '>Refund and Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;