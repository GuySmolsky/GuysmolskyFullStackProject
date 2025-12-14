import User from "../models/User.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { email: new RegExp(search, "i") },
        { "profile.firstName": new RegExp(search, "i") },
        { "profile.lastName": new RegExp(search, "i") },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .populate("profile.company", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
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
        message: "Failed to fetch users",
        details: error.message,
      },
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!["jobseeker", "employer", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid role",
        },
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
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
        message: "Failed to update user role",
        details: error.message,
      },
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: "User not found",
        },
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Cannot delete admin users",
        },
      });
    }

    await Job.deleteMany({ postedBy: user._id });

    if (user.profile.company) {
      await Company.findByIdAndDelete(user.profile.company);
      await Job.deleteMany({ company: user.profile.company });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User and all associated data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to delete user",
        details: error.message,
      },
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments({ isActive: true });
    const totalCompanies = await Company.countDocuments();
    const totalApplications = await Job.aggregate([
      { $unwind: "$applications" },
      { $count: "total" },
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const jobsByCategory = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const recentJobs = await Job.find({ isActive: true })
      .populate("company", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications: totalApplications[0]?.total || 0,
        usersByRole,
        jobsByCategory,
        recentJobs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch statistics",
        details: error.message,
      },
    });
  }
};
