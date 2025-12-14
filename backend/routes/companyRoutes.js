import express from "express";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyJobs,
} from "../controllers/companyController.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.get("/:id/jobs", getCompanyJobs);

router.post("/", auth, createCompany);
router.put("/:id", auth, updateCompany);
router.delete("/:id", auth, authorize("admin"), deleteCompany);

export default router;
