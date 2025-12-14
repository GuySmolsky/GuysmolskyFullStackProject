import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  alpha,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import SaveIcon from "@mui/icons-material/Save";
import DescriptionIcon from "@mui/icons-material/Description";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionButton = motion(Button);

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    location: "",
    skills: "",
  });

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        firstName: user.profile.firstName || "",
        lastName: user.profile.lastName || "",
        phone: user.profile.phone || "",
        bio: user.profile.bio || "",
        location: user.profile.location || "",
        skills: user.profile.skills?.join(", ") || "",
      });
    }
    if (user?.role === "jobseeker") {
      fetchApplications();
      fetchSavedJobs();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/jobs/applications");
      setApplications(response.data.data);
    } catch (error) {
      console.error("Failed to fetch applications");
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get("/jobs/saved");
      setSavedJobs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch saved jobs");
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/save`);
      setMessage({ type: "success", text: "Job removed from saved jobs" });
      fetchSavedJobs();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to remove job" });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const profileData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill),
      };

      const response = await api.put("/auth/profile", profileData);
      updateUser(response.data.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error?.message || "Failed to update profile",
      });
    }
    setLoading(false);
  };

  const getInitials = () => {
    if (!user?.profile) return "?";
    const firstInitial = user.profile.firstName?.charAt(0) || "";
    const lastInitial = user.profile.lastName?.charAt(0) || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                fontSize: 40,
                fontWeight: "bold",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              {getInitials()}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95 }}>
                {user?.email}
              </Typography>
              <Chip
                label={user?.role === "employer" ? "Employer" : "Job Seeker"}
                sx={{
                  mt: 1,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {message.text && (
          <Alert
            severity={message.type}
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setMessage({ type: "", text: "" })}
          >
            {message.text}
          </Alert>
        )}

        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              px: 2,
            }}
          >
            <Tab
              label="Profile Information"
              icon={<PersonIcon />}
              iconPosition="start"
              sx={{ fontWeight: 600 }}
            />
            {user?.role === "jobseeker" && [
              <Tab
                key="applications"
                label="My Applications"
                icon={<DescriptionIcon />}
                iconPosition="start"
                sx={{ fontWeight: 600 }}
              />,
              <Tab
                key="saved"
                label="Saved Jobs"
                icon={<FavoriteIcon />}
                iconPosition="start"
                sx={{ fontWeight: 600 }}
              />,
            ]}
          </Tabs>

          {/* Profile Tab */}
          {activeTab === 0 && (
            <MotionPaper
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              elevation={0}
              sx={{ p: 4 }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="bold"
                  sx={{ mb: 3 }}
                >
                  Personal Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={user?.email}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <EmailIcon sx={{ mr: 1, color: "action.disabled" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon
                            sx={{ mr: 1, color: "primary.main" }}
                          />
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      name="bio"
                      multiline
                      rows={4}
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  {user?.role === "jobseeker" && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="JavaScript, React, Node.js (comma separated)"
                        InputProps={{
                          startAdornment: (
                            <WorkIcon sx={{ mr: 1, color: "primary.main" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                  )}
                </Grid>

                <Divider sx={{ my: 4 }} />

                <MotionButton
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </MotionButton>
              </Box>
            </MotionPaper>
          )}

          {/* Applications Tab */}
          {activeTab === 1 && user?.role === "jobseeker" && (
            <MotionPaper
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              elevation={0}
              sx={{ p: 4 }}
            >
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                My Applications ({applications.length})
              </Typography>

              {applications.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <DescriptionIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No applications yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Start applying to jobs to see them here
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {applications.map((application, index) => (
                    <Grid item xs={12} key={index}>
                      <MotionCard
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{
                          x: 5,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        }}
                        sx={{
                          borderRadius: 3,
                          border: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/jobs/${application.jobId?._id}`)
                        }
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight="bold"
                              >
                                {application.jobId?.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {application.jobId?.company?.name}
                              </Typography>
                            </Box>
                            <Chip
                              label={application.status || "pending"}
                              color={
                                application.status === "accepted"
                                  ? "success"
                                  : application.status === "rejected"
                                  ? "error"
                                  : "warning"
                              }
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Applied:{" "}
                            {new Date(
                              application.appliedAt
                            ).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </MotionCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </MotionPaper>
          )}

          {/* Saved Jobs Tab */}
          {activeTab === 2 && user?.role === "jobseeker" && (
            <MotionPaper
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              elevation={0}
              sx={{ p: 4 }}
            >
              <Typography
                variant="h6"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                Saved Jobs ({savedJobs.length})
              </Typography>

              {savedJobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <FavoriteIcon
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    No saved jobs yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Save jobs you're interested in to view them here
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {savedJobs.map((job, index) => (
                    <Grid item xs={12} key={job._id}>
                      <MotionCard
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{
                          x: 5,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                        }}
                        sx={{
                          borderRadius: 3,
                          border: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box
                              sx={{ flexGrow: 1, cursor: "pointer" }}
                              onClick={() => navigate(`/jobs/${job._id}`)}
                            >
                              <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight="bold"
                              >
                                {job.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                {job.company?.name}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                <Chip label={job.jobType} size="small" />
                                <Chip
                                  label={job.experienceLevel}
                                  size="small"
                                />
                                <Chip
                                  label={
                                    job.location?.city ||
                                    job.location ||
                                    "Remote"
                                  }
                                  size="small"
                                  icon={<LocationOnIcon />}
                                />
                              </Box>
                            </Box>
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnsaveJob(job._id);
                              }}
                              sx={{
                                "&:hover": {
                                  bgcolor: "error.lighter",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </MotionCard>
                    </Grid>
                  ))}
                </Grid>
              )}
            </MotionPaper>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;
