import mongoose from "mongoose";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const start = async (req, res) => {
  if (req.user) {
    return res.status(200).json(new ApiResponse(200, req.user, "User Found"));
  } else {
    return res.status(404).json(new ApiResponse(404, null, "Use Not Found"));
  }
};

const registerUser = async (req, res) => {
  console.log("Registration Started");
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    console.log("Registration Failed data insufficeient ");
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Please provide all required fields: fullName, email, and password."
        )
      );
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Registration Failed already registered user");
      return res
        .status(409)
        .json(new ApiError(409, "User already registered."));
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    console.log("Registration Successful");
    res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
          },
        },
        "User successfully registered."
      )
    );
  } catch (err) {
    // Change the error parameter to err
    console.log("Registration Failed due to server error");
    console.error("Error while creating user:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error.", [], err.stack));
  }
  // return res.status(200).send("Hello WOrld")
};

const loginUser = async (req, res) => {
  console.log("Login Started");
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Login Failed: Missing required fields");
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Please provide all required fields: email and password."
        )
      );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Login Failed: User not found");
      return res.status(404).json(new ApiError(404, "User not found."));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      console.log("Login Failed: Invalid credentials");
      return res.status(406).json(new ApiError(406, "Invalid credentials."));
    }

    const jwtToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN } // Add token expiration for better security
    );

    const isDev = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "dev";
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set cookie to expire in 1 day
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
    };
    

    console.log("Login Successful");
    return res
      .cookie("token", jwtToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user._id,
              email: user.email,
              fullName: user.fullName,
            },
          },
          "User logged in successfully."
        )
      );
  } catch (err) {
    console.log("Login Failed: Server error");
    console.error("Error during login:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], err.stack));
  }
};

const logoutUser = (req, res) => {
  console.log("Logged out");
  if (req.user) {
    return res
      .clearCookie("token")
      .status(200)
      .json(new ApiResponse(200, null, "User logged out successfully."));
  } else {
    return res.status(404).json(new ApiError(404, "User not found."));
  }
};

const loginGuest = async (req, res) => {
  console.log("Guest Login Started");
  try {
    const uniqueId = Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const email = `guest_${uniqueId}@example.com`;
    const fullName = `Guest User`;
    const password = Math.random().toString(36).substring(2, 10);

    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    console.log("Guest Registration Successful");

    const jwtToken = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN }
    );

    const isDev = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "dev";
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: isDev ? "lax" : "none",
      secure: !isDev,
    };

    console.log("Guest Login Successful");
    return res
      .cookie("token", jwtToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: newUser._id,
              email: newUser.email,
              fullName: newUser.fullName,
            },
          },
          "Guest logged in successfully."
        )
      );
  } catch (err) {
    console.log("Guest Login Failed: Server error");
    console.error("Error during guest login:", err);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], err.stack));
  }
};

export { start, loginUser, logoutUser, registerUser, loginGuest };
