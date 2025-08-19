import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css'
import { BrowserRouter } from "react-router-dom"
import App from './App.jsx'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("pk_test_51RCwNR4h25tFCpy5sH1zzAnlhkhxNmUzpGs72ix0SPlGw4CDxWhRgMdYWoANkdecIJfngqTJMVp4wAr0iPZ7srR900M0vYzWO4");


createRoot(document.getElementById('root')).render(
  

  <Elements stripe={stripePromise}>
  <BrowserRouter>
  <App/>
  </BrowserRouter>
  </Elements>
)
