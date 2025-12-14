import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: "User not found",
        },
      });
    }

    const resetToken = user.generatePasswordResetToken();

    res.json({
      success: true,
      message: "Password reset token generated",
      data: {
        resetToken,
        resetUrl: `http://localhost:3000/reset-password/${resetToken}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to request password reset",
        details: error.message,
      },
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid reset token",
        },
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: "User not found",
        },
      });
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        error: {
          message: "New password cannot be the same as your current password",
        },
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        error: {
          message: "Reset token expired",
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: "Failed to reset password",
        details: error.message,
      },
    });
  }
};
