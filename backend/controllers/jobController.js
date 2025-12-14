import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      category,
      jobType,
      experienceLevel,
      location,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (location) {
      query["location.city"] = new RegExp(location, "i");
    }

    if (minSalary || maxSalary) {
      query["salary.min"] = {};
      if (minSalary) query["salary.min"].$gte = Number(minSalary);
      if (maxSalary) query["salary.max"] = { $lte: Number(maxSalary) };
    }

    const jobs = await Job.find(query)
      .populate("company", "name logo location industry")
      .populate("postedBy", "profile.firstName profile.lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch jobs",
        details: error.message,
      },
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("postedBy", "profile email")
      .populate("applications.applicant", "profile email");

    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Job not found",
        },
      });
    }

    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch job",
        details: error.message,
      },
    });
  }
};

export const createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Only employers can post jobs",
        },
      });
    }

    let company = await Company.findOne({ createdBy: req.user._id });

    if (!company) {
      company = await Company.create({
        name: req.body.companyName || `${req.user.profile.firstName}'s Company`,
        industry: req.body.industry || "Technology",
        description: req.body.companyDescription || "Company description",
        location: req.body.location || {
          city: "New York",
          country: "USA",
        },
        size: req.body.companySize || "1-10",
        createdBy: req.user._id,
      });
    }

    const jobData = {
      ...req.body,
      company: company._id,
      postedBy: req.user._id,
    };

    const job = await Job.create(jobData);

    res.status(201).json({
      success: true,
      data: await job.populate("company"),
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
      },
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Job not found",
        },
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: {
          message: "Not authorized to update this job",
        },
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("company");

    res.json({
      success: true,
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to update job",
        details: error.message,
      },
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Job not found",
        },
      });
    }

    if (job.postedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: {
          message: "Not authorized to delete this job",
        },
      });
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to delete job",
        details: error.message,
      },
    });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Job not found",
        },
      });
    }

    const alreadyApplied = job.applications.some(
      (app) => app.applicant.toString() === userId
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        error: {
          message: "You have already applied to this job",
        },
      });
    }

    job.applications.push({
      applicant: userId,
      coverLetter,
      appliedAt: new Date(),
    });

    await job.save();

    await User.findByIdAndUpdate(userId, {
      $push: {
        appliedJobs: {
          jobId: jobId,
          appliedAt: new Date(),
        },
      },
    });

    res.json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to apply to job",
        details: error.message,
      },
    });
  }
};

export const saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Job not found",
        },
      });
    }

    const user = await User.findById(userId);
    const isAlreadySaved = user.savedJobs.includes(jobId);

    if (isAlreadySaved) {
      await User.findByIdAndUpdate(userId, {
        $pull: { savedJobs: jobId },
      });

      res.json({
        success: true,
        message: "Job removed from saved jobs",
        saved: false,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { savedJobs: jobId },
      });

      res.json({
        success: true,
        message: "Job saved successfully",
        saved: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to save job",
        details: error.message,
      },
    });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedJobs",
      populate: {
        path: "company",
        select: "name logo location",
      },
    });

    res.json({
      success: true,
      data: user.savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch saved jobs",
        details: error.message,
      },
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "appliedJobs.jobId",
      populate: {
        path: "company",
        select: "name logo location",
      },
    });

    res.json({
      success: true,
      data: user.appliedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch applications",
        details: error.message,
      },
    });
  }
};
