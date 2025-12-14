import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["jobseeker", "employer", "admin"],
      default: "jobseeker",
    },
    profile: {
      firstName: String,
      lastName: String,
      phone: String,
      location: String,
      profilePicture: String,
      resume: String,
      skills: [String],
      experience: String,
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    appliedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "reviewed", "rejected", "accepted"],
          default: "pending",
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = jwt.sign(
    { id: this._id, purpose: "password-reset" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
