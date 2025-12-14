import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [editDialog, setEditDialog] = useState({ open: false, user: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchStats();
    fetchUsers();
    fetchJobs();
    fetchCompanies();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data.data.stats);
    } catch (error) {
      console.error("Failed to fetch stats");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get("/admin/jobs");
      setJobs(response.data.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/admin/companies");
      setCompanies(response.data.data);
    } catch (error) {
      console.error("Failed to fetch companies");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setMessage({ type: "success", text: "User deleted successfully" });
      fetchUsers();
      fetchStats();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete user" });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setMessage({ type: "success", text: "Job deleted successfully" });
      fetchJobs();
      fetchStats();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete job" });
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (
      !window.confirm(
        "Are you sure? This will also delete all jobs from this company!"
      )
    )
      return;

    try {
      await api.delete(`/admin/companies/${companyId}`);
      setMessage({ type: "success", text: "Company deleted successfully" });
      fetchCompanies();
      fetchJobs();
      fetchStats();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete company" });
    }
  };

  const handleEditUser = (user) => {
    setEditDialog({ open: true, user });
  };

  const handleUpdateUser = async () => {
    try {
      await api.put(`/admin/users/${editDialog.user._id}`, {
        role: editDialog.user.role,
      });
      setMessage({ type: "success", text: "User updated successfully" });
      setEditDialog({ open: false, user: null });
      fetchUsers();
      fetchStats();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user" });
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h5" textAlign="center" sx={{ mt: 4 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Manage users, jobs, and platform content
          </Typography>
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

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              icon: PeopleIcon,
              label: "Total Users",
              value: stats.totalUsers || 0,
              gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
            {
              icon: WorkIcon,
              label: "Total Jobs",
              value: stats.totalJobs || 0,
              gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            },
            {
              icon: BusinessIcon,
              label: "Total Companies",
              value: stats.totalCompanies || 0,
              gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            },
            {
              icon: AssignmentIcon,
              label: "Total Applications",
              value: stats.totalApplications || 0,
              gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                }}
                sx={{
                  textAlign: "center",
                  p: 3,
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
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    background: stat.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    boxShadow: `0 8px 16px ${alpha("#667eea", 0.3)}`,
                  }}
                >
                  <stat.icon sx={{ fontSize: 32, color: "white" }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary">
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

        {/* User Breakdown */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {stats.jobSeekers || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Job Seekers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold" color="secondary">
                {stats.employers || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Employers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {stats.admins || 0}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Admins
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              px: 2,
            }}
          >
            <Tab label="Users" sx={{ fontWeight: 600 }} />
            <Tab label="Jobs" sx={{ fontWeight: 600 }} />
            <Tab label="Companies" sx={{ fontWeight: 600 }} />
          </Tabs>

          {/* Users Tab */}
          {activeTab === 0 && (
            <Box sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Role</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          {user.profile?.firstName} {user.profile?.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            color={
                              user.role === "admin"
                                ? "error"
                                : user.role === "employer"
                                ? "primary"
                                : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={user.role === "admin"}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Jobs Tab */}
          {activeTab === 1 && (
            <Box sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Title</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Company</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Type</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Posted By</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job._id} hover>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.company?.name}</TableCell>
                        <TableCell>
                          <Chip label={job.jobType} size="small" />
                        </TableCell>
                        <TableCell>{job.postedBy?.email}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteJob(job._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Companies Tab */}
          {activeTab === 2 && (
            <Box sx={{ p: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Industry</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Size</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Created By</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {companies.map((company) => (
                      <TableRow key={company._id} hover>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.size}</TableCell>
                        <TableCell>{company.createdBy?.email}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCompany(company._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, user: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Role"
            value={editDialog.user?.role || ""}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                user: { ...editDialog.user, role: e.target.value },
              })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="jobseeker">Job Seeker</MenuItem>
            <MenuItem value="employer">Employer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, user: null })}>
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
