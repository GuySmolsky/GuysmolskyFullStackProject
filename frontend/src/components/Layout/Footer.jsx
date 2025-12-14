import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider,
  IconButton,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";

const MotionIconButton = motion(IconButton);

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "background.paper" : "grey.100",
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 2,
                  p: 0.8,
                  display: "flex",
                }}
              >
                <WorkIcon sx={{ color: "white", fontSize: 24 }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                JobBoard
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Connecting talented professionals with their dream careers. Find
              your next opportunity today.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <MotionIconButton
                component="a"
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <FacebookIcon fontSize="small" />
              </MotionIconButton>
              <MotionIconButton
                component="a"
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <TwitterIcon fontSize="small" />
              </MotionIconButton>
              <MotionIconButton
                component="a"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <LinkedInIcon fontSize="small" />
              </MotionIconButton>
              <MotionIconButton
                component="a"
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                whileHover={{ scale: 1.2, y: -3 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <InstagramIcon fontSize="small" />
              </MotionIconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component={RouterLink}
                to="/"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/jobs"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Jobs
              </Link>
              <Link
                component={RouterLink}
                to="/companies"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Companies
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                About
              </Link>
            </Box>
          </Grid>

          {/* For Job Seekers */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              For Job Seekers
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component={RouterLink}
                to="/jobs"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Browse Jobs
              </Link>
              <Link
                component={RouterLink}
                to="/login"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                My Profile
              </Link>
              <Link
                component={RouterLink}
                to="/register"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Create Account
              </Link>
            </Box>
          </Grid>

          {/* For Employers */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              For Employers
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                component={RouterLink}
                to="/login"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Post a Job
              </Link>
              <Link
                component={RouterLink}
                to="/login"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Employer Login
              </Link>
              <Link
                component={RouterLink}
                to="/register"
                underline="none"
                color="text.secondary"
                sx={{
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s",
                }}
              >
                Employer Signup
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} JobBoard. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
