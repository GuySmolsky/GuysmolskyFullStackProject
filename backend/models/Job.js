import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [String],
    benefits: [String],
    location: {
      city: String,
      country: String,
      isRemote: {
        type: Boolean,
        default: false,
      },
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "manager", "director"],
      required: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "ILS",
      },
      isDisclosed: {
        type: Boolean,
        default: true,
      },
    },
    category: {
      type: String,
      required: true,
    },
    skills: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationDeadline: Date,
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        coverLetter: String,
        status: {
          type: String,
          enum: ["pending", "reviewed", "shortlisted", "rejected", "accepted"],
          default: "pending",
        },
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: "text", description: "text", skills: "text" });
jobSchema.index({ category: 1, jobType: 1, experienceLevel: 1 });
jobSchema.index({ "location.city": 1, "location.country": 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
