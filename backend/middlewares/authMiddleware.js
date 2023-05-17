import jwt from "jsonwebtoken";

import asyncHandler from "express-async-handler";
import User from "../models/user.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId).select("-password");
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("not authorize user");
  }
});

export { protect };
