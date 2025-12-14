import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Pagination,
  CircularProgress,
  Paper,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FilterListIcon from "@mui/icons-material/FilterList";
import WorkIcon from "@mui/icons-material/Work";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import api from "../services/api";

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const JobsPage = () => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    jobType: searchParams.get("jobType") || "",
    experienceLevel: searchParams.get("experienceLevel") || "",
    location: searchParams.get("location") || "",
  });

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 9,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      };

      const response = await api.get("/jobs", { params });
      setJobs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch jobs");
    }
    setLoading(false);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, page: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      jobType: "",
      experienceLevel: "",
      location: "",
    });
    setPagination({ ...pagination, page: 1 });
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
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Find Your Perfect Job
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Browse through {pagination.total} available positions
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Filters */}
        <Paper
          elevation={2}
          sx={{ p: 3, mb: 4, borderRadius: 3, overflow: "visible" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <FilterListIcon sx={{ fontSize: 28, color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold">
              Filter Jobs
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by job title or keyword"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel
                  id="job-type-label"
                  sx={{ backgroundColor: "background.paper", px: 0.5 }}
                >
                  Job Type
                </InputLabel>
                <Select
                  labelId="job-type-label"
                  value={filters.jobType}
                  onChange={(e) =>
                    handleFilterChange("jobType", e.target.value)
                  }
                  label="Job Type"
                  sx={{
                    borderRadius: 2,
                    "& .MuiSelect-select": {
                      py: "14px",
                    },
                  }}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="full-time">Full Time</MenuItem>
                  <MenuItem value="part-time">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel
                  id="experience-level-label"
                  sx={{ backgroundColor: "background.paper", px: 0.5 }}
                >
                  Experience Level
                </InputLabel>
                <Select
                  labelId="experience-level-label"
                  value={filters.experienceLevel}
                  onChange={(e) =>
                    handleFilterChange("experienceLevel", e.target.value)
                  }
                  label="Experience Level"
                  sx={{
                    borderRadius: 2,
                    "& .MuiSelect-select": {
                      py: "14px",
                    },
                  }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  <MenuItem value="entry">Entry Level</MenuItem>
                  <MenuItem value="mid">Mid Level</MenuItem>
                  <MenuItem value="senior">Senior Level</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="director">Director</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth sx={{ minWidth: 120 }}>
                <InputLabel
                  id="category-label"
                  sx={{ backgroundColor: "background.paper", px: 0.5 }}
                >
                  Category
                </InputLabel>
                <Select
                  labelId="category-label"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  label="Category"
                  sx={{
                    borderRadius: 2,
                    "& .MuiSelect-select": {
                      py: "14px",
                    },
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Healthcare">Healthcare</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Customer Service">Customer Service</MenuItem>
                  <MenuItem value="Human Resources">Human Resources</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Clear All Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Jobs Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : jobs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <WorkIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No jobs found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your filters or search criteria
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {jobs.map((job, index) => (
                <Grid item xs={12} md={4} key={job._id}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
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
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {job.title}
                      </Typography>
                      <Typography
                        variant="body2"
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
                          ${job.salary.min?.toLocaleString()} - $
                          {job.salary.max?.toLocaleString()}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          gap: 1,
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

            {pagination.pages > 1 && (
              <Box display="flex" justifyContent="center" mt={5}>
                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default JobsPage;
