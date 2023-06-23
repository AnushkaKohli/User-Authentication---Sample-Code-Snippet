const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require("../controllers/userController");
const express = require("express");
const router = express.Router();

// http://localhost:3000/api/register
router.route("/register").post(registerUser);
// http://localhost:3000/api/login
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);

module.exports = router;