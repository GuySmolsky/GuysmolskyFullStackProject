import Company from "../models/Company.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

export const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, industry } = req.query;
    const query = {};

    if (search) {
      query.name = new RegExp(search, "i");
    }

    if (industry) {
      query.industry = industry;
    }

    const companies = await Company.find(query)
      .populate("createdBy", "profile.firstName profile.lastName email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(query);

    res.json({
      success: true,
      data: companies,
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
        message: "Failed to fetch companies",
        details: error.message,
      },
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "createdBy",
      "profile.firstName profile.lastName email"
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Company not found",
        },
      });
    }

    const jobCount = await Job.countDocuments({
      company: company._id,
      isActive: true,
    });

    const companyData = company.toObject();
    companyData.jobCount = jobCount;

    res.json({
      success: true,
      data: companyData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch company",
        details: error.message,
      },
    });
  }
};

export const createCompany = async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      createdBy: req.user.id,
    };

    const existingCompany = await Company.findOne({
      name: companyData.name,
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Company with this name already exists",
        },
      });
    }

    const company = await Company.create(companyData);

    await User.findByIdAndUpdate(req.user.id, {
      "profile.company": company._id,
      role: "employer",
    });

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to create company",
        details: error.message,
      },
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Company not found",
        },
      });
    }

    if (
      company.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Not authorized to update this company",
        },
      });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to update company",
        details: error.message,
      },
    });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Company not found",
        },
      });
    }

    if (
      company.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Not authorized to delete this company",
        },
      });
    }

    await Job.deleteMany({ company: company._id });
    await company.deleteOne();

    res.json({
      success: true,
      message: "Company and all associated jobs deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to delete company",
        details: error.message,
      },
    });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const jobs = await Job.find({
      company: req.params.id,
      isActive: true,
    })
      .populate("company", "name logo")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments({
      company: req.params.id,
      isActive: true,
    });

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
        message: "Failed to fetch company jobs",
        details: error.message,
      },
    });
  }
};
