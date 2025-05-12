const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "2hr";

exports.register = async (req, res) => {
  try {
    const { username, emailId, password } = req.body;
    if (!username || !emailId || !password) {
      return res.status(400).json({
        success: false,
        message: "All Field Required",
      });
    }
    const exitingUser = await User.findOne({ emailId });
    if (exitingUser) {
      return res.status(400).json({
        success: false,
        message: "Email-Id Already Exits",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      emailId,
      password: hashPassword,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered Successfully",
      user: {
        id: user._id,
        username: user.username,
        emailId: user.emailId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Registration Failed : ${error.message}`,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // check emailId & passsword
    if (!password || !emailId) {
      return res.status(400).json({
        success: false,
        message: "Email-Id & Password must require",
      });
    }
    //find emailId
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential",
      });
    }

    // compare password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Password Does not matched",
      });
    }
    const token = jwt.sign(
      { _id: user._id, username: user.username, emailId: user.emailId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
    // sending response

    res.status(200).json({
      success: true,
      message: `${user.username} login successfully`,
      user: {
        username: user.username,
        emailId: user.emailId,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Login Failed : ${error.message}`,
    });
  }
};
exports.logout = async (req, res) => {
  try {
    // No server-side token invalidation needed for simple JWT
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Logout Failed: ${error.message}`,
    });
  }
};