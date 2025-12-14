import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Pagination,
  CircularProgress,
  Avatar,
  Paper,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";
import api from "../services/api";

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchCompanies();
  }, [pagination.page, searchTerm]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
      };

      const response = await api.get("/companies", { params });
      setCompanies(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch companies");
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (event, value) => {
    setPagination({ ...pagination, page: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            Explore Companies
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95 }}>
            Discover {pagination.total} companies hiring now
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search Bar */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <TextField
            fullWidth
            placeholder="Search companies by name or industry"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 28, color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : companies.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
            <BusinessIcon
              sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No companies found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {companies.map((company, index) => (
                <Grid item xs={12} md={4} key={company._id}>
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
                    <CardContent
                      sx={{ flexGrow: 1, textAlign: "center", p: 3 }}
                    >
                      <Avatar
                        sx={{
                          width: 90,
                          height: 90,
                          mx: "auto",
                          mb: 2,
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontSize: 36,
                          fontWeight: "bold",
                        }}
                      >
                        {company.name.charAt(0)}
                      </Avatar>
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {company.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        gutterBottom
                        fontWeight={600}
                        sx={{ mb: 2 }}
                      >
                        {company.industry}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          mb: 1,
                          p: 1,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.info.main, 0.1),
                        }}
                      >
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ color: "info.main" }}
                        />
                        <Typography
                          variant="body2"
                          color="info.main"
                          fontWeight={600}
                        >
                          {company.location?.city}, {company.location?.country}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          p: 1,
                          borderRadius: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.secondary.main, 0.1),
                        }}
                      >
                        <PeopleIcon
                          fontSize="small"
                          sx={{ color: "secondary.main" }}
                        />
                        <Typography
                          variant="body2"
                          color="secondary.main"
                          fontWeight={600}
                        >
                          {company.size} employees
                        </Typography>
                      </Box>

                      {company.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            lineHeight: 1.6,
                          }}
                        >
                          {company.description}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <MotionButton
                        size="medium"
                        component={Link}
                        to={`/companies/${company._id}`}
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
                        View Company
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

export default CompaniesPage;
