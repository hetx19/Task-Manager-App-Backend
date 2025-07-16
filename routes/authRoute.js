const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const {
  signUp,
  signIn,
  getUserProfile,
  updateUserProfile,
  uploadImage,
  updateUserProfileImage,
  deleteUserProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/profile", protect, deleteUserProfile);
router.put(
  "/profile-image",
  protect,
  upload.single("image"),
  updateUserProfileImage
);
router.post("/upload-image", upload.single("image"), uploadImage);

module.exports = router;
