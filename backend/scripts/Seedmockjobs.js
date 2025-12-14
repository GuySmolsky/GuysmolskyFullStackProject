import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

dotenv.config();

const createMockJobs = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/Fullstack_Final_Project"
    );
    console.log("MongoDB connected");

    let employer = await User.findOne({ role: "employer" });

    if (!employer) {
      employer = await User.findOne({ role: "admin" });
    }

    if (!employer) {
      employer = await User.create({
        email: "employer@jobboard.com",
        password: "Employer@1234",
        role: "employer",
        profile: {
          firstName: "Mock",
          lastName: "Employer",
        },
      });
      console.log("Created mock employer");
    }

    const techCorpData = {
      name: "TechCorp Solutions",
      description:
        "Leading technology company specializing in innovative software solutions and digital transformation services. We're committed to building cutting-edge applications that solve real-world problems.",
      industry: "Technology",
      location: {
        city: "Tel Aviv",
        country: "Israel",
      },
      size: "201-500",
      website: "https://www.techcorp.com",
      createdBy: employer._id,
    };

    const marketingProData = {
      name: "Marketing Pro Agency",
      description:
        "Creative digital marketing agency helping brands connect with their audiences through innovative campaigns and data-driven strategies.",
      industry: "Marketing",
      location: {
        city: "New York",
        country: "USA",
      },
      size: "51-200",
      website: "https://www.marketingpro.com",
      createdBy: employer._id,
    };

    const financeGlobalData = {
      name: "Finance Global Ltd",
      description:
        "International financial services firm providing investment banking, wealth management, and advisory services to clients worldwide.",
      industry: "Finance",
      location: {
        city: "London",
        country: "UK",
      },
      size: "1000+",
      website: "https://www.financeglobal.com",
      createdBy: employer._id,
    };

    let techCorp = await Company.findOneAndUpdate(
      { name: techCorpData.name },
      techCorpData,
      { upsert: true, new: true }
    );

    let marketingPro = await Company.findOneAndUpdate(
      { name: marketingProData.name },
      marketingProData,
      { upsert: true, new: true }
    );

    let financeGlobal = await Company.findOneAndUpdate(
      { name: financeGlobalData.name },
      financeGlobalData,
      { upsert: true, new: true }
    );

    console.log("Companies created/updated");

    const mockJobs = [
      {
        title: "Senior Full Stack Developer",
        company: techCorp._id,
        description: `We are seeking an experienced Senior Full Stack Developer to join our dynamic team at TechCorp Solutions. 

The ideal candidate will have strong expertise in modern web technologies and a passion for building scalable applications. You will be responsible for designing and implementing both front-end and back-end solutions, mentoring junior developers, and contributing to our technical architecture decisions.

Key Responsibilities:
• Design and develop full-stack web applications using React.js and Node.js
• Collaborate with product managers and designers to implement new features
• Write clean, maintainable, and well-documented code
• Participate in code reviews and provide constructive feedback
• Optimize applications for maximum performance and scalability
• Mentor junior developers and contribute to team knowledge sharing

What We Offer:
• Competitive salary and equity options
• Flexible working hours and remote work options
• Professional development budget
• Health insurance and wellness programs
• Modern office in the heart of Tel Aviv
• Regular team events and hackathons`,
        requirements: [
          "5+ years of experience in full-stack development",
          "Strong proficiency in JavaScript, React.js, and Node.js",
          "Experience with MongoDB and RESTful API design",
          "Solid understanding of web security best practices",
          "Experience with cloud platforms (AWS/Azure/GCP)",
          "Excellent problem-solving and communication skills",
          "Bachelor's degree in Computer Science or equivalent experience",
        ],
        benefits: [
          "Competitive salary package",
          "Stock options",
          "Flexible working hours",
          "Remote work options",
          "Health and dental insurance",
          "Annual learning budget of $2,000",
          "Free gym membership",
          "Daily catered lunch",
        ],
        location: {
          city: "Tel Aviv",
          country: "Israel",
          isRemote: true,
        },
        jobType: "full-time",
        experienceLevel: "senior",
        salary: {
          min: 25000,
          max: 35000,
          currency: "ILS",
          isDisclosed: true,
        },
        category: "Technology",
        skills: [
          "JavaScript",
          "React.js",
          "Node.js",
          "MongoDB",
          "REST API",
          "AWS",
          "Git",
          "Agile",
        ],
        isActive: true,
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        postedBy: employer._id,
        views: 150,
      },
      {
        title: "Digital Marketing Manager",
        company: marketingPro._id,
        description: `Marketing Pro Agency is looking for a creative and data-driven Digital Marketing Manager to lead our client campaigns and drive exceptional results.

As our Digital Marketing Manager, you will develop and execute comprehensive digital marketing strategies for our diverse portfolio of clients. You'll work closely with our creative team, analyze campaign performance, and ensure we deliver outstanding ROI for our clients.

Key Responsibilities:
• Develop and implement digital marketing strategies across multiple channels
• Manage PPC campaigns on Google Ads, Facebook, and LinkedIn
• Oversee content marketing initiatives and SEO strategies
• Analyze campaign metrics and provide actionable insights
• Manage client relationships and present campaign results
• Lead and mentor a team of marketing specialists
• Stay updated with the latest digital marketing trends and tools

Why Join Us:
• Work with prestigious international brands
• Creative and collaborative work environment
• Opportunity to shape marketing strategies for diverse industries
• Access to cutting-edge marketing tools and platforms`,
        requirements: [
          "4+ years of experience in digital marketing",
          "Proven track record of successful campaign management",
          "Expert knowledge of Google Ads, Facebook Business Manager, and LinkedIn Ads",
          "Strong analytical skills and experience with Google Analytics",
          "Excellent written and verbal communication skills",
          "Experience with marketing automation tools",
          "Bachelor's degree in Marketing, Communications, or related field",
        ],
        benefits: [
          "Competitive base salary plus performance bonuses",
          "Comprehensive health coverage",
          "401(k) matching",
          "Professional development opportunities",
          "Flexible work schedule",
          "Summer Fridays",
          "Annual team retreat",
        ],
        location: {
          city: "New York",
          country: "USA",
          isRemote: false,
        },
        jobType: "full-time",
        experienceLevel: "mid",
        salary: {
          min: 75000,
          max: 95000,
          currency: "USD",
          isDisclosed: true,
        },
        category: "Marketing",
        skills: [
          "Google Ads",
          "Facebook Ads",
          "SEO",
          "Content Marketing",
          "Analytics",
          "HubSpot",
          "Leadership",
        ],
        isActive: true,
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        postedBy: employer._id,
        views: 89,
      },
      {
        title: "Junior Financial Analyst",
        company: financeGlobal._id,
        description: `Finance Global Ltd is seeking a motivated Junior Financial Analyst to join our London office and support our investment banking division.

This is an excellent opportunity for a recent graduate or early-career professional to launch their career in finance with a leading global firm. You will work alongside senior analysts and associates on high-profile transactions and gain exposure to various aspects of investment banking.

Key Responsibilities:
• Assist in financial modeling and valuation analysis
• Prepare pitch books and client presentations
• Conduct industry and company research
• Support due diligence processes for M&A transactions
• Analyze financial statements and market data
• Maintain and update financial databases
• Collaborate with cross-functional teams on deal execution

What Sets Us Apart:
• Structured training program and mentorship
• Exposure to international transactions
• Clear career progression path
• Collaborative and inclusive culture`,
        requirements: [
          "Bachelor's degree in Finance, Economics, Accounting, or related field",
          "0-2 years of experience in finance or related field",
          "Strong proficiency in Excel and financial modeling",
          "Excellent analytical and quantitative skills",
          "Attention to detail and ability to work under pressure",
          "Strong written and verbal communication skills",
          "Knowledge of Bloomberg Terminal is a plus",
        ],
        benefits: [
          "Competitive entry-level salary",
          "Year-end performance bonus",
          "Comprehensive training program",
          "Private health insurance",
          "Pension contribution matching",
          "Study support for professional certifications (CFA, FRM)",
          "Subsidized gym membership",
          "Season ticket loan",
        ],
        location: {
          city: "London",
          country: "UK",
          isRemote: false,
        },
        jobType: "full-time",
        experienceLevel: "entry",
        salary: {
          min: 35000,
          max: 45000,
          currency: "GBP",
          isDisclosed: true,
        },
        category: "Finance",
        skills: [
          "Excel",
          "Financial Modeling",
          "PowerPoint",
          "Research",
          "Data Analysis",
          "Accounting",
        ],
        isActive: true,
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        postedBy: employer._id,
        views: 234,
      },
    ];

    for (const jobData of mockJobs) {
      const existingJob = await Job.findOne({
        title: jobData.title,
        company: jobData.company,
      });

      if (!existingJob) {
        await Job.create(jobData);
        console.log(`Created job: ${jobData.title}`);
      } else {
        console.log(`Job already exists: ${jobData.title}`);
      }
    }

    console.log("\n✅ Mock jobs created successfully!");
    console.log("You should now see 3 featured jobs on your homepage.");

    process.exit(0);
  } catch (error) {
    console.error("Error creating mock jobs:", error);
    process.exit(1);
  }
};

createMockJobs();
