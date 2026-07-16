const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { encryptPhone } = require("../utils/encrypt");
require("dotenv").config();

// 1. signup
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, age } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const encryptedPhone = encryptPhone(phone);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: encryptedPhone,
      age,
    });

    await user.save();

    res.status(201).json({ message: "User added successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. update logged in user (except password)
const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { password, ...updateData } = req.body; // never allow password here

    if (updateData.email) {
      const emailTaken = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });
      if (emailTaken) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. delete logged in user
const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. get logged in user data
const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login, updateUser, deleteUser, getUser };
