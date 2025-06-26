const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const signUp = async (req, res) => {
  try {
    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    const checkUserExists = await User.findOne({ email });

    if (checkUserExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    let role = "member";

    if (
      adminInviteToken &&
      adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      profileImageUrl: profileImageUrl,
      role: role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const { name, email, password, profileImageUrl, adminInviteToken } =
      req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;

    if (email) {
      const checkEmail = await User.findOne({ email });

      if (!checkEmail) {
        user.email = email;
      } else {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (
      adminInviteToken &&
      user.role == "member" &&
      adminInviteToken == process.env.ADMIN_INVITE_TOKEN
    ) {
      user.role = "admin";
    }

    user.profileImageUrl = profileImageUrl || user.profileImageUrl;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profileImageUrl: updatedUser.profileImageUrl,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No File Uploaded" });
  }

  cloudinary.uploader.upload(
    req.file.path,
    { folder: "task-manager" },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        return res.status(200).json({ imageUrl: result.secure_url });
      }
    }
  );
};

module.exports = {
  signUp,
  signIn,
  getUserProfile,
  updateUserProfile,
  uploadImage,
};
