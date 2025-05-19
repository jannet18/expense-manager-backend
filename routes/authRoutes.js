const express = require("express");

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/loginUser", loginUser);
router.get("/getUser", protect, getUserInfo);

module.exports = router;
