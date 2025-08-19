import jwt from "jsonwebtoken";
import config from "../config.js"; // add .js if you're using ES modules

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    req.userId = decoded.id; // attach user ID to request
    next();
  } catch (error) {
    console.log("Invalid or expired token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default userMiddleware;