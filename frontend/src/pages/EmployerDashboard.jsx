import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalViews: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
    category: "Technology",
    jobType: "full-time",
    experienceLevel: "mid",
    location: {
      city: "",
      country: "",
      isRemote: false,
    },
    salary: {
      min: 0,
      max: 0,
      currency: "USD",
      isDisclosed: true,
    },
    skills: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const companyRes = await api.get("/companies");
      const userCompany = companyRes.data.data.find(
        (comp) =>
          comp.createdBy?._id === user?.id || comp.createdBy === user?.id
      );

      if (userCompany) {
        setCompany(userCompany);

        const jobsRes = await api.get(`/companies/${userCompany._id}/jobs`);
        setJobs(jobsRes.data.data || []);

        const activeJobs = jobsRes.data.data.filter((job) => job.isActive);
        const totalApplications = jobsRes.data.data.reduce(
          (sum, job) => sum + (job.applications?.length || 0),
          0
        );
        const totalViews = jobsRes.data.data.reduce(
          (sum, job) => sum + (job.views || 0),
          0
        );

        setStats({
          totalJobs: jobsRes.data.data.length,
          activeJobs: activeJobs.length,
          totalApplications,
          totalViews,
        });
      } else {
        setCompany(null);
        setJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setMessage({ type: "error", text: "Failed to load dashboard data" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async () => {
    try {
      const companyData = {
        name: `${user.profile.firstName}'s Company`,
        description: "Company description",
        industry: "Technology",
        location: {
          city: "New York",
          country: "USA",
        },
        size: "1-10",
      };

      const response = await api.post("/companies", companyData);
      setCompany(response.data.data);
      setMessage({ type: "success", text: "Company created successfully!" });
      fetchDashboardData();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create company" });
    }
  };

  const handlePostJob = async () => {
    try {
      if (!company) {
        setMessage({ type: "error", text: "Please create a company first" });
        return;
      }

      const jobData = {
        ...jobForm,
        company: company._id,
        requirements: jobForm.requirements.split("\n").filter((r) => r.trim()),
        benefits: jobForm.benefits.split("\n").filter((b) => b.trim()),
        skills: jobForm.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      if (selectedJob) {
        await api.put(`/jobs/${selectedJob._id}`, jobData);
        setMessage({ type: "success", text: "Job updated successfully!" });
      } else {
        await api.post("/jobs", jobData);
        setMessage({ type: "success", text: "Job posted successfully!" });
      }

      setOpenJobDialog(false);
      resetJobForm();
      fetchDashboardData();
    } catch (error) {
      console.error("Error posting job:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error?.message || "Failed to post job",
      });
    }
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setJobForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements?.join("\n") || "",
      benefits: job.benefits?.join("\n") || "",
      category: job.category,
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      location: job.location || { city: "", country: "", isRemote: false },
      salary: job.salary || {
        min: 0,
        max: 0,
        currency: "USD",
        isDisclosed: true,
      },
      skills: job.skills?.join(", ") || "",
    });
    setOpenJobDialog(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await api.delete(`/jobs/${jobId}`);
        setMessage({ type: "success", text: "Job deleted successfully" });
        fetchDashboardData();
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete job" });
      }
    }
  };

  const resetJobForm = () => {
    setJobForm({
      title: "",
      description: "",
      requirements: "",
      benefits: "",
      category: "Technology",
      jobType: "full-time",
      experienceLevel: "mid",
      location: { city: "", country: "", isRemote: false },
      salary: { min: 0, max: 0, currency: "USD", isDisclosed: true },
      skills: "",
    });
    setSelectedJob(null);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Employer Dashboard
      </Typography>

      {message.text && (
        <Alert
          severity={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
          sx={{ mb: 2 }}
        >
          {message.text}
        </Alert>
      )}

      {!company ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <BusinessIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Create Your Company Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You need to create a company profile before posting jobs
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCompany}
          >
            Create Company
          </Button>
        </Paper>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Jobs
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stats.totalJobs}
                      </Typography>
                    </Box>
                    <WorkIcon sx={{ fontSize: 40, color: "primary.main" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Active Jobs
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="success.main"
                      >
                        {stats.activeJobs}
                      </Typography>
                    </Box>
                    <WorkIcon sx={{ fontSize: 40, color: "success.main" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Applications
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="info.main"
                      >
                        {stats.totalApplications}
                      </Typography>
                    </Box>
                    <PeopleIcon sx={{ fontSize: 40, color: "info.main" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Total Views
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="secondary.main"
                      >
                        {stats.totalViews}
                      </Typography>
                    </Box>
                    <VisibilityIcon
                      sx={{ fontSize: 40, color: "secondary.main" }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Company Info */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Company Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Company Name
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {company.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Industry
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {company.industry}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {company.location?.city}, {company.location?.country}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Company Size
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {company.size} employees
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Jobs Management */}
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight="bold">
                Your Job Postings
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  resetJobForm();
                  setOpenJobDialog(true);
                }}
              >
                Post New Job
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {jobs.length === 0 ? (
              <Box textAlign="center" py={4}>
                <WorkIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="body1" color="text.secondary">
                  No jobs posted yet. Click "Post New Job" to get started!
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Applications</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job._id}>
                        <TableCell>
                          <Typography variant="body1" fontWeight="500">
                            {job.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {job.location?.city}, {job.location?.country}
                          {job.location?.isRemote && " (Remote)"}
                        </TableCell>
                        <TableCell>
                          <Chip label={job.jobType} size="small" />
                        </TableCell>
                        <TableCell>{job.applications?.length || 0}</TableCell>
                        <TableCell>{job.views || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={job.isActive ? "Active" : "Inactive"}
                            color={job.isActive ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/jobs/${job._id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditJob(job)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </>
      )}

      {/* Job Dialog */}
      <Dialog
        open={openJobDialog}
        onClose={() => setOpenJobDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedJob ? "Edit Job" : "Post New Job"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={jobForm.title}
                onChange={(e) =>
                  setJobForm({ ...jobForm, title: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={jobForm.description}
                onChange={(e) =>
                  setJobForm({ ...jobForm, description: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Requirements (one per line)"
                value={jobForm.requirements}
                onChange={(e) =>
                  setJobForm({ ...jobForm, requirements: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Benefits (one per line)"
                value={jobForm.benefits}
                onChange={(e) =>
                  setJobForm({ ...jobForm, benefits: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={jobForm.category}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, category: e.target.value })
                  }
                  label="Category"
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  value={jobForm.jobType}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, jobType: e.target.value })
                  }
                  label="Job Type"
                >
                  <MenuItem value="full-time">Full Time</MenuItem>
                  <MenuItem value="part-time">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={jobForm.experienceLevel}
                  onChange={(e) =>
                    setJobForm({ ...jobForm, experienceLevel: e.target.value })
                  }
                  label="Experience Level"
                >
                  <MenuItem value="entry">Entry</MenuItem>
                  <MenuItem value="mid">Mid</MenuItem>
                  <MenuItem value="senior">Senior</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="director">Director</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Skills (comma-separated)"
                value={jobForm.skills}
                onChange={(e) =>
                  setJobForm({ ...jobForm, skills: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                value={jobForm.location.city}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: { ...jobForm.location, city: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Country"
                value={jobForm.location.country}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    location: { ...jobForm.location, country: e.target.value },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Remote</InputLabel>
                <Select
                  value={jobForm.location.isRemote}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      location: {
                        ...jobForm.location,
                        isRemote: e.target.value,
                      },
                    })
                  }
                  label="Remote"
                >
                  <MenuItem value={false}>No</MenuItem>
                  <MenuItem value={true}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Min Salary"
                value={jobForm.salary.min}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    salary: { ...jobForm.salary, min: Number(e.target.value) },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Max Salary"
                value={jobForm.salary.max}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    salary: { ...jobForm.salary, max: Number(e.target.value) },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={jobForm.salary.currency}
                  onChange={(e) =>
                    setJobForm({
                      ...jobForm,
                      salary: { ...jobForm.salary, currency: e.target.value },
                    })
                  }
                  label="Currency"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="ILS">ILS</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button onClick={handlePostJob} variant="contained">
            {selectedJob ? "Update Job" : "Post Job"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployerDashboard;
