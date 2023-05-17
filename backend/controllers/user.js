import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

//@desc Auth user/set token
//route POST /api/users/auth
//@access Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const { password, ...info } = user._doc;
    generateToken(res, user._id);
    res.status(201).json(info);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc Register new user
//route POST /api/users/
//@access Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    const { password, ...info } = user._doc;
    generateToken(res, user._id);
    res.status(201).json(info);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Logout user
//route POST /api/users/logout
//@access Public

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,

    expires: new Date(0),
  });
  res.status(200).json({ message: "user logged out" });
});

//@desc  get user profile
//route get /api/users/profile
//@access private

const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "get user" });
});

//@desc  update user profile
//route POST /api/users/profile
//@access private

const updateUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "update user" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
