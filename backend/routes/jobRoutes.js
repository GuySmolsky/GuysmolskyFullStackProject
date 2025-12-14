import express from "express";
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
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllJobs);
router.get("/saved", auth, getSavedJobs);
router.get("/applications", auth, getMyApplications);
router.get("/:id", getJobById);

router.post("/", auth, authorize("employer", "admin"), createJob);
router.put("/:id", auth, authorize("employer", "admin"), updateJob);
router.delete("/:id", auth, authorize("employer", "admin"), deleteJob);

router.post("/:id/apply", auth, applyToJob);
router.post("/:id/save", auth, saveJob);

export default router;
