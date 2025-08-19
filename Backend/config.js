import dotenv from "dotenv";
dotenv.config(); 

const config = {
  JWT_USER_PASSWORD: process.env.JWT_USER_PASSWORD || "fallback-secret-key",
  JWT_ADMIN_PASSWORD: process.env.JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY, 
};

export default config;