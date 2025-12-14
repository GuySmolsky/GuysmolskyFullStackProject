import express from "express";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/users", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 100, search = "", role = "" } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { "profile.firstName": { $regex: search, $options: "i" } },
        { "profile.lastName": { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

router.put("/users/:id", adminAuth, async (req, res) => {
  try {
    const { role, profile } = req.body;

    const updateData = {};
    if (role) updateData.role = role;
    if (profile) updateData.profile = profile;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User not found",
        },
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

router.get("/jobs", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;

    const jobs = await Job.find()
      .populate("company")
      .populate("postedBy", "email profile.firstName profile.lastName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Job.countDocuments();

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

router.delete("/jobs/:id", adminAuth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: "JOB_NOT_FOUND",
          message: "Job not found",
        },
      });
    }

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments();

    const jobSeekers = await User.countDocuments({ role: "jobseeker" });
    const employers = await User.countDocuments({ role: "employer" });
    const admins = await User.countDocuments({ role: "admin" });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalJobs,
          totalCompanies,
          totalApplications,
          jobSeekers,
          employers,
          admins,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

router.get("/companies", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;

    const companies = await Company.find()
      .populate("createdBy", "email profile.firstName profile.lastName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Company.countDocuments();

    res.json({
      success: true,
      data: companies,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

router.delete("/companies/:id", adminAuth, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: {
          code: "COMPANY_NOT_FOUND",
          message: "Company not found",
        },
      });
    }

    await Job.deleteMany({ company: req.params.id });

    res.json({
      success: true,
      message: "Company and associated jobs deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Server error",
      },
    });
  }
});

export default router;
