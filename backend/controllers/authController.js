import User from "../models/User.js";
import Company from "../models/Company.js";

export const register = async (req, res) => {
  try {
    const { email, password, role, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Email already registered",
        },
      });
    }

    const user = new User({
      email,
      password,
      role,
      profile: {
        firstName,
        lastName,
      },
    });

    await user.save();
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Registration failed",
        details: error.message,
      },
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("profile.company");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Invalid credentials",
        },
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Account deactivated",
        },
      });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@jobboard.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
    }

    const token = user.generateToken();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Login failed",
        details: error.message,
      },
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

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
    console.log("getProfile error:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch profile",
        details: error.message,
      },
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      "profile",
      "skills",
      "experience",
      "location",
      "phone",
    ];
    const updates = Object.keys(req.body);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid updates",
        },
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Profile update failed",
      },
    });
  }
};
