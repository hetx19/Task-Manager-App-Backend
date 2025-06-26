const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const {
  signUp,
  signIn,
  getUserProfile,
  updateUserProfile,
  uploadImage,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/upload-image", upload.single("image"), uploadImage);

module.exports = router;
