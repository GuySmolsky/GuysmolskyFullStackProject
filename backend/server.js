import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import {
  requestPasswordReset,
  resetPassword,
} from "./controllers/passwordResetController.js";

import {
  register,
  login,
  getProfile,
  updateProfile,
} from "./controllers/authController.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "./validators/authValidator.js";
import { auth, authorize } from "./middleware/auth.js";

import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  saveJob,
  getSavedJobs,
  getMyApplications,
} from "./controllers/jobController.js";

import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyJobs,
} from "./controllers/companyController.js";

import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getStatistics,
} from "./controllers/adminController.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.post("/api/auth/register", validateRequest(registerSchema), register);
app.post("/api/auth/login", validateRequest(loginSchema), login);
app.get("/api/auth/profile", auth, getProfile);
app.put("/api/auth/profile", auth, updateProfile);
app.post("/api/auth/request-password-reset", requestPasswordReset);
app.post("/api/auth/reset-password/:token", resetPassword);

app.get("/api/jobs", getAllJobs);
app.get("/api/jobs/saved", auth, getSavedJobs);
app.get("/api/jobs/applications", auth, getMyApplications);
app.get("/api/jobs/:id", getJobById);
app.post("/api/jobs", auth, authorize("employer", "admin"), createJob);
app.put("/api/jobs/:id", auth, authorize("employer", "admin"), updateJob);
app.delete("/api/jobs/:id", auth, authorize("employer", "admin"), deleteJob);
app.post("/api/jobs/:id/apply", auth, applyToJob);
app.post("/api/jobs/:id/save", auth, saveJob);

app.get("/api/companies", getAllCompanies);
app.get("/api/companies/:id", getCompanyById);
app.get("/api/companies/:id/jobs", getCompanyJobs);
app.post("/api/companies", auth, createCompany);
app.put("/api/companies/:id", auth, updateCompany);
app.delete("/api/companies/:id", auth, authorize("admin"), deleteCompany);

app.get("/api/admin/users", auth, authorize("admin"), getAllUsers);
app.put("/api/admin/users/:id/role", auth, authorize("admin"), updateUserRole);
app.delete("/api/admin/users/:id", auth, authorize("admin"), deleteUser);
app.get("/api/admin/statistics", auth, authorize("admin"), getStatistics);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res
    .status(404)
    .json({ error: "Route not found", attempted: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/Fullstack_Final_Project";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Ready to test!");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
