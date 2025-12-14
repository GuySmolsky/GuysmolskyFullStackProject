import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@jobboard.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@1234";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists");
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Admin role updated");
    } else {
      const admin = await User.create({
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        profile: {
          firstName: "Admin",
          lastName: "User",
        },
      });
      console.log("Admin user created successfully");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
