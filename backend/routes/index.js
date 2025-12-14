import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "../validators/authValidator.js";
import { auth, authorize } from "../middleware/auth.js";
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
} from "../controllers/jobController.js";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyJobs,
} from "../controllers/companyController.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getStatistics,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

router.post("/auth/register", validateRequest(registerSchema), register);
router.post("/auth/login", validateRequest(loginSchema), login);
router.get("/auth/profile", auth, getProfile);
router.put("/auth/profile", auth, updateProfile);

router.get("/jobs", getAllJobs);
router.get("/jobs/saved", auth, getSavedJobs);
router.get("/jobs/applications", auth, getMyApplications);
router.get("/jobs/:id", getJobById);
router.post("/jobs", auth, authorize("employer", "admin"), createJob);
router.put("/jobs/:id", auth, authorize("employer", "admin"), updateJob);
router.delete("/jobs/:id", auth, authorize("employer", "admin"), deleteJob);
router.post("/jobs/:id/apply", auth, applyToJob);
router.post("/jobs/:id/save", auth, saveJob);

router.get("/companies", getAllCompanies);
router.get("/companies/:id", getCompanyById);
router.get("/companies/:id/jobs", getCompanyJobs);
router.post("/companies", auth, createCompany);
router.put("/companies/:id", auth, updateCompany);
router.delete("/companies/:id", auth, authorize("admin"), deleteCompany);

router.get("/admin/users", auth, authorize("admin"), getAllUsers);
router.put("/admin/users/:id/role", auth, authorize("admin"), updateUserRole);
router.delete("/admin/users/:id", auth, authorize("admin"), deleteUser);
router.get("/admin/statistics", auth, authorize("admin"), getStatistics);

export default router;
