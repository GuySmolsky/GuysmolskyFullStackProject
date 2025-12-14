import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  alpha,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import LanguageIcon from "@mui/icons-material/Language";
import WorkIcon from "@mui/icons-material/Work";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import api from "../services/api";

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
    fetchCompanyJobs();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      const response = await api.get(`/companies/${id}`);
      setCompany(response.data.data);
    } catch (error) {
      console.error("Failed to fetch company details");
    }
    setLoading(false);
  };

  const fetchCompanyJobs = async () => {
    try {
      const response = await api.get(`/companies/${id}/jobs`);
      setJobs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch company jobs");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!company) {
    return (
      <Container>
        <Typography variant="h5" textAlign="center" sx={{ mt: 4 }}>
          Company not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <MotionButton
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/companies")}
            sx={{
              mb: 2,
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
            Back to Companies
          </MotionButton>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Company Info Card */}
          <Grid item xs={12} md={4}>
            <MotionPaper
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                position: "sticky",
                top: 20,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontSize: 48,
                  fontWeight: "bold",
                  boxShadow: "0 8px 24px rgba(102,126,234,0.3)",
                }}
              >
                {company.name.charAt(0)}
              </Avatar>

              <Typography variant="h4" gutterBottom fontWeight="bold">
                {company.name}
              </Typography>

              <Chip
                label={company.industry}
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              />

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "left", mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <LocationOnIcon sx={{ color: "info.main" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {company.location?.city}, {company.location?.country}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <PeopleIcon sx={{ color: "secondary.main" }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Company Size
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {company.size} employees
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </MotionPaper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* About Section */}
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              elevation={2}
              sx={{ p: 4, mb: 4, borderRadius: 3 }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BusinessIcon sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  About {company.name}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}
              >
                {company.description}
              </Typography>
            </MotionPaper>

            {/* Open Positions */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WorkIcon sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  Open Positions ({jobs.length})
                </Typography>
              </Box>
            </Box>

            {jobs.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
                <WorkIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  No open positions
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Check back later for new opportunities
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {jobs.map((job, index) => (
                  <Grid item xs={12} key={job._id}>
                    <MotionCard
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{
                        x: 5,
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                      }}
                      sx={{
                        borderRadius: 3,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          {job.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <LocationOnIcon
                            fontSize="small"
                            sx={{ color: "primary.main" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {job.location?.city}, {job.location?.country}
                            {job.location?.isRemote && " (Remote)"}
                          </Typography>
                        </Box>
                        {job.salary?.isDisclosed && (
                          <Typography
                            variant="body2"
                            color="primary"
                            gutterBottom
                            fontWeight={600}
                          >
                            ${job.salary.min.toLocaleString()} - $
                            {job.salary.max.toLocaleString()}
                          </Typography>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            mt: 2,
                            flexWrap: "wrap",
                          }}
                        >
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
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CompanyDetailsPage;
