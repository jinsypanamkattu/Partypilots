const express = require("express");
//const upload = require("../config/multer");
const upload = require("../middleware/upload");


const { registerUser, loginUser, updateUser, deleteUser,listUsers , fetchUser, updateUserStatus, forgetPassword, verifyOtp, resetPassword } = require("../controllers/userController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");


const router = express.Router()

router.post("/forgot-password", forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.post("/register",upload.single('profileImage'), registerUser)

router.post("/login",loginUser)

router.put("/update/:userId", authenticate, upload.single('profileImage'), updateUser);// Only logged-in users can update their profile

router.delete("/delete/:userId", authenticate, authorizeRoles("admin"), deleteUser); // Only admins can delete users

router.get("/list", authenticate, authorizeRoles("admin","organizer"), listUsers); // Only admins can list all users
router.get("/list/:id", authenticate, authorizeRoles("admin","organizer"), listUsers); // Organizer can listing all his users

router.patch("/update/:id/status", authenticate, authorizeRoles("admin"), updateUserStatus); // Only admins can update user status



router.get("/profile", authenticate, fetchUser);



module.exports = router;