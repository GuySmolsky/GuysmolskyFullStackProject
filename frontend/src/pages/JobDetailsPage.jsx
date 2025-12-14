import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const MotionPaper = motion(Paper);

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isEmployer, isAdmin } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isJobOwner, setIsJobOwner] = useState(false);

  useEffect(() => {
    fetchJob();
    if (isAuthenticated && user) {
      checkIfSaved();

      if (!isEmployer && !isAdmin) {
        checkIfApplied();
      }
    }
  }, [id, isAuthenticated, isEmployer]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data);

      if (user && response.data.data.postedBy) {
        const posterId =
          response.data.data.postedBy._id || response.data.data.postedBy;
        setIsJobOwner(posterId === user.id);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load job details" });
    }
    setLoading(false);
  };

  const checkIfSaved = async () => {
    try {
      const response = await api.get("/jobs/saved");
      const savedJobs = response.data.data;
      setIsSaved(savedJobs.some((savedJob) => savedJob._id === id));
    } catch (error) {
      console.error("Failed to check saved status");
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await api.get("/jobs/applications");
      const applications = response.data.data;
      setHasApplied(applications.some((app) => app.jobId?._id === id));
    } catch (error) {
      console.error("Failed to check application status");
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/jobs/${id}/save`);
      setIsSaved(!isSaved);
      setMessage({
        type: "success",
        text: isSaved ? "Job removed from favorites" : "Job saved to favorites",
      });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save job" });
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setApplyLoading(true);
    try {
      await api.post(`/jobs/${id}/apply`, { coverLetter });
      setHasApplied(true);
      setOpenApplyDialog(false);
      setMessage({
        type: "success",
        text: "Application submitted successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error?.message ||
          "Failed to submit application",
      });
    }
    setApplyLoading(false);
  };

  const handleEditJob = () => {
    navigate("/employer/dashboard");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return (
      <Container>
        <Typography variant="h5" textAlign="center" sx={{ mt: 4 }}>
          Job not found
        </Typography>
      </Container>
    );
  }

  const renderActionButton = () => {
    if (!isAuthenticated) {
      return (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate("/login")}
        >
          Login to Apply
        </Button>
      );
    }

    if (isJobOwner || isAdmin) {
      return (
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<EditIcon />}
          onClick={handleEditJob}
        >
          Edit This Job
        </Button>
      );
    }

    if (isEmployer) {
      return (
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Employers cannot apply to jobs
          </Typography>
        </Box>
      );
    }

    if (hasApplied) {
      return (
        <Button variant="contained" disabled fullWidth>
          Already Applied
        </Button>
      );
    }

    return (
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => setOpenApplyDialog(true)}
      >
        Apply Now
      </Button>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/jobs")}
        sx={{ mb: 2 }}
      >
        Back to Jobs
      </Button>

      {message.text && (
        <Alert
          severity={message.type}
          sx={{ mb: 2 }}
          onClose={() => setMessage({ type: "", text: "" })}
        >
          {message.text}
        </Alert>
      )}

      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        elevation={2}
        sx={{ p: 4 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {job.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {job.company?.name}
                </Typography>
              </Box>
              {/* Only show save button for job seekers */}
              {!isEmployer && !isAdmin && (
                <IconButton onClick={handleSaveJob} color="primary">
                  {isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <Chip
                icon={<LocationOnIcon />}
                label={`${job.location?.city}, ${job.location?.country}`}
              />
              <Chip icon={<WorkIcon />} label={job.jobType} color="primary" />
              <Chip label={job.experienceLevel} />
              {job.location?.isRemote && (
                <Chip label="Remote" color="success" />
              )}
            </Box>

            {job.salary?.isDisclosed && (
              <Typography variant="h6" color="primary" gutterBottom>
                {job.salary.min.toLocaleString()} -{" "}
                {job.salary.max.toLocaleString()} {job.salary.currency}
              </Typography>
            )}

            <Box sx={{ mt: 3 }}>{renderActionButton()}</Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 3, bgcolor: "background.default" }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Job Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Category
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {job.category}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Views
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {job.views}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Applications
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {job.applications?.length || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Posted
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {new Date(job.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Job Description
          </Typography>
          <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-line" }}>
            {job.description}
          </Typography>
        </Box>

        {job.requirements && job.requirements.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Requirements
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              {job.requirements.map((req, index) => (
                <Typography
                  component="li"
                  variant="body1"
                  sx={{ mb: 1 }}
                  key={index}
                >
                  {req}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {job.benefits && job.benefits.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Benefits
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              {job.benefits.map((benefit, index) => (
                <Typography
                  component="li"
                  variant="body1"
                  sx={{ mb: 1 }}
                  key={index}
                >
                  {benefit}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {job.skills && job.skills.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Required Skills
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {job.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}
      </MotionPaper>

      <Dialog
        open={openApplyDialog}
        onClose={() => setOpenApplyDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Apply for {job.title}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Cover Letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Tell us why you're a great fit for this position..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplyDialog(false)}>Cancel</Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={applyLoading || !coverLetter.trim()}
          >
            {applyLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobDetailsPage;
