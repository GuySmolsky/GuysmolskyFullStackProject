import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  InputAdornment,
  Chip,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import api from "../services/api";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, users: 0 });

  useEffect(() => {
    fetchFeaturedJobs();
    fetchStats();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const response = await api.get("/jobs?limit=3");
      setFeaturedJobs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
    }
  };

  const fetchStats = async () => {
    try {
      const jobsRes = await api.get("/jobs");
      const companiesRes = await api.get("/companies");
      setStats({
        jobs: jobsRes.data.pagination?.total || 0,
        companies: companiesRes.data.pagination?.total || 0,
        users: 150,
      });
    } catch (error) {
      console.error("Failed to fetch stats");
    }
  };

  const handleSearch = () => {
    window.location.href = `/jobs?search=${searchTerm}`;
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 6, md: 10 },
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
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            textAlign="center"
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                mb: 2,
              }}
            >
              Find Your Dream Job
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 5,
                opacity: 0.95,
                fontWeight: 400,
              }}
            >
              Discover thousands of opportunities with leading companies
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(30, 41, 59, 0.9)"
                    : "white",
                p: 1,
                borderRadius: 3,
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                placeholder="Job title, keywords, or company"
                variant="outlined"
                size="medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" sx={{ fontSize: 28 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { border: "none" },
                    "& input": {
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "#000",
                    },
                    "& input::placeholder": {
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(0,0,0,0.6)",
                      opacity: 1,
                    },
                  },
                }}
              />
              <MotionButton
                variant="contained"
                size="large"
                onClick={handleSearch}
                endIcon={<ArrowForwardIcon />}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  minWidth: { xs: "100%", sm: 150 },
                  height: 56,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(102,126,234,0.4)",
                  },
                }}
              >
                Search
              </MotionButton>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {[
            {
              icon: WorkIcon,
              value: stats.jobs,
              label: "Active Jobs",
              gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
            {
              icon: BusinessIcon,
              value: stats.companies,
              label: "Companies",
              gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            },
            {
              icon: PeopleIcon,
              value: `${stats.users}+`,
              label: "Job Seekers",
              gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            },
          ].map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionCard
                whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
                sx={{
                  textAlign: "center",
                  p: 4,
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
                    background: stat.gradient,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "16px",
                    background: stat.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: `0 8px 16px ${alpha("#667eea", 0.3)}`,
                  }}
                >
                  <stat.icon sx={{ fontSize: 36, color: "white" }} />
                </Box>
                <Typography variant="h3" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={500}
                >
                  {stat.label}
                </Typography>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Featured Jobs Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <TrendingUpIcon sx={{ fontSize: 36, color: "primary.main" }} />
            <Typography variant="h4" fontWeight="bold">
              Featured Jobs
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Top opportunities handpicked for you
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {featuredJobs.map((job, index) => (
            <Grid item xs={12} md={4} key={job._id}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {job.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                    fontWeight={500}
                  >
                    {job.company?.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      my: 2,
                    }}
                  >
                    <LocationOnIcon
                      fontSize="small"
                      sx={{ color: "primary.main" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {job.location?.city}, {job.location?.country}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={job.jobType}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                      }}
                    />
                    <Chip
                      label={job.experienceLevel}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        bgcolor: (theme) =>
                          alpha(theme.palette.secondary.main, 0.1),
                        color: "secondary.main",
                      }}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <MotionButton
                    size="medium"
                    component={Link}
                    to={`/jobs/${job._id}`}
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      borderWidth: 2,
                      fontWeight: 600,
                      "&:hover": {
                        borderWidth: 2,
                      },
                    }}
                  >
                    View Details
                  </MotionButton>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center" }}>
          <MotionButton
            variant="contained"
            size="large"
            component={Link}
            to="/jobs"
            endIcon={<ArrowForwardIcon />}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 8px 16px rgba(102,126,234,0.3)",
            }}
          >
            Explore All Jobs
          </MotionButton>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
