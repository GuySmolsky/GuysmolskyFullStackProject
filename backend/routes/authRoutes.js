import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "../validators/authValidator.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

export default router;
