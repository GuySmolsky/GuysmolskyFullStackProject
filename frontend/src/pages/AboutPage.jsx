import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from "@mui/icons-material/Speed";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

const AboutPage = () => {
  const features = [
    {
      icon: WorkIcon,
      title: "Thousands of Jobs",
      description:
        "Access to a large job database with opportunities from top companies across various industries.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: BusinessIcon,
      title: "Top Companies",
      description:
        "Connect with leading employers and startups looking for talented professionals.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: SpeedIcon,
      title: "Easy Applications",
      description:
        "Apply to multiple jobs with just one click using your saved profile.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: TrendingUpIcon,
      title: "Career Growth",
      description:
        "Find opportunities that match your skills and help you advance your career.",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      icon: SecurityIcon,
      title: "Secure Platform",
      description:
        "Your data is protected with enterprise-level security and encryption.",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      icon: SupportAgentIcon,
      title: "24/7 Support",
      description:
        "Get help whenever you need it with our dedicated support team.",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Jobs", icon: WorkIcon },
    { value: "500+", label: "Companies", icon: BusinessIcon },
    { value: "50,000+", label: "Happy Users", icon: PeopleIcon },
    { value: "95%", label: "Success Rate", icon: VerifiedUserIcon },
  ];

  const jobSeekerSteps = [
    {
      label: "Create Your Account",
      description:
        "Sign up for free by clicking the Register button. Fill in your personal details including your name, email, and create a secure password. Choose 'Job Seeker' as your account type.",
      icon: PersonAddIcon,
    },
    {
      label: "Complete Your Profile",
      description:
        "Build a compelling profile by adding your skills, work experience, education, and uploading your resume. A complete profile increases your chances of getting noticed by employers.",
      icon: ManageAccountsIcon,
    },
    {
      label: "Search for Jobs",
      description:
        "Browse through thousands of job listings using our powerful search and filter options. Filter by location, job type, salary range, experience level, and more to find the perfect match.",
      icon: SearchIcon,
    },
    {
      label: "Save & Apply",
      description:
        "Save interesting jobs to review later or apply directly with one click. Track all your applications from your dashboard and receive notifications about your application status.",
      icon: SendIcon,
    },
  ];

  const employerSteps = [
    {
      label: "Register as Employer",
      description:
        "Create an employer account by selecting 'Employer' during registration. This gives you access to the employer dashboard and job posting features.",
      icon: PersonAddIcon,
    },
    {
      label: "Set Up Your Company",
      description:
        "Add your company details including company name, description, logo, industry, and location. A well-detailed company profile attracts more qualified candidates.",
      icon: BusinessIcon,
    },
    {
      label: "Post Job Listings",
      description:
        "Create detailed job postings with job title, description, requirements, salary range, and benefits. Use our easy-to-use form to reach thousands of potential candidates.",
      icon: PostAddIcon,
    },
    {
      label: "Manage Applications",
      description:
        "Review applications from your dashboard, communicate with candidates, and update application statuses. Our tools help you find the best talent efficiently.",
      icon: DashboardIcon,
    },
  ];

  const jobSeekerFeatures = [
    "Create and manage your professional profile",
    "Upload and update your resume",
    "Search jobs with advanced filters",
    "Save jobs for later review",
    "Apply to jobs with one click",
    "Track application status",
    "Receive job recommendations",
    "Get notified about new matching jobs",
  ];

  const employerFeatures = [
    "Post unlimited job listings",
    "Manage company profile",
    "Review and filter applications",
    "Communicate with candidates",
    "Track hiring pipeline",
    "Access analytics and insights",
    "Featured job placement options",
    "Bulk job posting tools",
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 10,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-50%",
            left: "-10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
            >
              About JobBoard
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.95, fontWeight: 400 }}>
              Your complete guide to finding jobs and hiring talent
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* What is JobBoard Section */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={2}
          sx={{ p: 5, mb: 6, borderRadius: 3 }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            What is JobBoard?
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            JobBoard is a comprehensive job search and recruitment platform
            designed to connect talented professionals with their dream careers,
            while helping employers find the perfect candidates for their teams.
            Our platform serves as a bridge between job seekers looking for new
            opportunities and companies seeking to grow their workforce.
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            Whether you're a fresh graduate looking for your first job, an
            experienced professional seeking new challenges, or a company
            looking to hire top talent, JobBoard provides all the tools you need
            to succeed. Our user-friendly interface, powerful search
            capabilities, and streamlined application process make job hunting
            and recruiting easier than ever.
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            The platform supports three types of users:{" "}
            <strong>Job Seekers</strong> who can search and apply for jobs,{" "}
            <strong>Employers</strong> who can post jobs and manage
            applications, and <strong>Administrators</strong> who oversee the
            entire platform.
          </Typography>
        </MotionPaper>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                }}
                sx={{
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 16px rgba(102,126,234,0.3)",
                  }}
                >
                  <stat.icon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {stat.label}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* How to Use - Job Seekers */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          elevation={2}
          sx={{ p: 5, mb: 6, borderRadius: 3 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            📋 How to Use JobBoard - For Job Seekers
          </Typography>

          <Stepper orientation="vertical" sx={{ mb: 4 }}>
            {jobSeekerSteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                      }}
                    >
                      <step.icon sx={{ fontSize: 22, color: "white" }} />
                    </Box>
                  )}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, py: 1 }}>
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ mt: 4 }}
          >
            Job Seeker Features:
          </Typography>
          <Grid container spacing={2}>
            {jobSeekerFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon
                    sx={{ color: "success.main", fontSize: 20 }}
                  />
                  <Typography variant="body1">{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </MotionPaper>

        {/* How to Use - Employers */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          elevation={2}
          sx={{ p: 5, mb: 6, borderRadius: 3 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            🏢 How to Use JobBoard - For Employers
          </Typography>

          <Stepper orientation="vertical" sx={{ mb: 4 }}>
            {employerSteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(240,147,251,0.3)",
                      }}
                    >
                      <step.icon sx={{ fontSize: 22, color: "white" }} />
                    </Box>
                  )}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, py: 1 }}>
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ mt: 4 }}
          >
            Employer Features:
          </Typography>
          <Grid container spacing={2}>
            {employerFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon
                    sx={{ color: "success.main", fontSize: 20 }}
                  />
                  <Typography variant="body1">{feature}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </MotionPaper>

        {/* Navigation Guide */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          elevation={2}
          sx={{ p: 5, mb: 6, borderRadius: 3 }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            🧭 Navigating the Platform
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", lineHeight: 1.8, mb: 3 }}
          >
            Here's a quick guide to the main sections of JobBoard:
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  🏠 Home
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  The landing page with featured jobs, quick search, and
                  platform highlights. Start your job search here or learn more
                  about what JobBoard offers.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  💼 Jobs
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Browse all available job listings. Use filters to narrow down
                  by location, job type, experience level, salary range, and
                  more. Click on any job to see full details and apply.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  🏢 Companies
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Explore companies that are hiring. View company profiles, see
                  their open positions, and learn about company culture before
                  applying.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  👤 Profile
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Manage your personal information, update your resume, add
                  skills, and track your job applications. Keep your profile
                  updated to attract employers.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  📊 Dashboard (Employers)
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Employer-exclusive area to post new jobs, manage existing
                  listings, review applications, and communicate with
                  candidates.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  ⚙️ Admin Panel (Admins)
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  Administrative tools for managing users, companies, job
                  listings, and overall platform settings. Only accessible to
                  administrators.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </MotionPaper>

        {/* Features Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 1 }}
          >
            Why Choose JobBoard?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 5 }}
          >
            Everything you need to find your perfect job or ideal candidate
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ display: "flex" }}>
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ display: "flex" }}
            >
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: feature.gradient,
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      background: feature.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      boxShadow: `0 8px 16px ${alpha("#667eea", 0.3)}`,
                    }}
                  >
                    <feature.icon sx={{ fontSize: 32, color: "white" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Getting Started CTA */}
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          elevation={0}
          sx={{
            p: 5,
            mt: 8,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Ready to Get Started?
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem", lineHeight: 1.8, mb: 2, opacity: 0.95 }}
          >
            Join thousands of job seekers and employers who have found success
            with JobBoard. Create your free account today and take the first
            step towards your next opportunity!
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1rem", opacity: 0.9 }}>
            Click the <strong>Register</strong> button in the top right corner
            to create your account, or <strong>Login</strong> if you already
            have one.
          </Typography>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default AboutPage;
