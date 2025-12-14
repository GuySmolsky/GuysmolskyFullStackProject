import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Company from "../models/Company.js";

dotenv.config();

const createMockUsers = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/Fullstack_Final_Project"
    );
    console.log("MongoDB connected");

    const jobSeekerData = {
      email: "johndoe@example.com",
      password: "JobSeeker@1234",
      role: "jobseeker",
      profile: {
        firstName: "John",
        lastName: "Doe",
        phone: "+1-555-0123",
        location: "San Francisco, CA",
        skills: [
          "JavaScript",
          "React.js",
          "Node.js",
          "Python",
          "SQL",
          "Git",
          "Agile",
          "Problem Solving",
        ],
        experience: "3 years",
        resume: "https://example.com/resume/johndoe.pdf",
      },
      isActive: true,
    };

    const employerData = {
      email: "sarah.smith@innovatetech.com",
      password: "Employer@1234",
      role: "employer",
      profile: {
        firstName: "Sarah",
        lastName: "Smith",
        phone: "+1-555-0456",
        location: "Austin, TX",
        experience: "HR Manager with 5 years experience",
      },
      isActive: true,
    };

    r;
    let jobSeeker = await User.findOne({ email: jobSeekerData.email });

    if (!jobSeeker) {
      jobSeeker = await User.create(jobSeekerData);
      console.log("✅ Created Job Seeker: John Doe");
      console.log("   Email: johndoe@example.com");
      console.log("   Password: JobSeeker@1234");
    } else {
      console.log("⚠️  Job Seeker already exists: johndoe@example.com");
    }

    let employer = await User.findOne({ email: employerData.email });

    if (!employer) {
      employer = await User.create(employerData);
      console.log("\n✅ Created Employer: Sarah Smith");
      console.log("   Email: sarah.smith@innovatetech.com");
      console.log("   Password: Employer@1234");

      const companyData = {
        name: "InnovateTech Solutions",
        description:
          "InnovateTech Solutions is a fast-growing startup focused on developing innovative SaaS products for the healthcare industry. We believe in empowering healthcare providers with cutting-edge technology to improve patient outcomes and streamline operations.",
        industry: "Technology",
        location: {
          city: "Austin",
          country: "USA",
        },
        size: "51-200",
        website: "https://www.innovatetech.com",
        createdBy: employer._id,
      };

      const existingCompany = await Company.findOne({ name: companyData.name });

      if (!existingCompany) {
        const company = await Company.create(companyData);

        employer.profile.company = company._id;
        await employer.save();

        console.log("\n✅ Created Company: InnovateTech Solutions");
        console.log("   Associated with employer: Sarah Smith");
      } else {
        console.log("\n⚠️  Company already exists: InnovateTech Solutions");
      }
    } else {
      console.log("⚠️  Employer already exists: sarah.smith@innovatetech.com");
    }

    const Job = mongoose.model("Job");
    const sampleJobs = await Job.find().limit(2);

    if (sampleJobs.length > 0 && jobSeeker) {
      jobSeeker.savedJobs = sampleJobs.map((job) => job._id);

      jobSeeker.appliedJobs = [
        {
          jobId: sampleJobs[0]._id,
          appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: "pending",
        },
      ];

      await jobSeeker.save();
      console.log("\n✅ Added sample saved and applied jobs for John Doe");
    }

    console.log("\n========================================");
    console.log("✅ Mock users created successfully!");
    console.log("========================================\n");
    console.log("You can now login with these accounts:\n");
    console.log("JOB SEEKER:");
    console.log("  Email: johndoe@example.com");
    console.log("  Password: JobSeeker@1234");
    console.log("\nEMPLOYER:");
    console.log("  Email: sarah.smith@innovatetech.com");
    console.log("  Password: Employer@1234");
    console.log("\nADMIN (if created):");
    console.log("  Email: admin@jobboard.com");
    console.log("  Password: Admin@1234");
    console.log("\n========================================");

    process.exit(0);
  } catch (error) {
    console.error("Error creating mock users:", error);
    process.exit(1);
  }
};

createMockUsers();
