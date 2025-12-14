import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionAlert = motion(Alert);

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "jobseeker",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const passwordRequirements = [
    {
      id: "length",
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      test: (pwd) => /[A-Z]/.test(pwd),
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      test: (pwd) => /[a-z]/.test(pwd),
    },
    {
      id: "numbers",
      label: "At least 4 numbers",
      test: (pwd) => (pwd.match(/\d/g) || []).length >= 4,
    },
    {
      id: "special",
      label: "One special character (@$!%*#?&^_-)",
      test: (pwd) => /[@$!%*#?&^_-]/.test(pwd),
    },
  ];

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
    setGeneralError("");

    if (name === "password") {
      setShowPasswordRequirements(value.length > 0);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must meet all requirements below";
      setShowPasswordRequirements(true);
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      document.getElementsByName(firstErrorField)[0]?.focus();
      return;
    }

    setLoading(true);
    setGeneralError("");
    setErrors({});

    try {
      const response = await api.post("/auth/register", formData);

      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        localStorage.setItem("loginTime", new Date().getTime().toString());

        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);

      if (error.response?.data?.error?.details) {
        const details = error.response.data.error.details;
        const fieldErrors = {};

        details.forEach((msg) => {
          if (msg.includes("email")) {
            fieldErrors.email = "Please enter a valid email address";
          } else if (msg.includes("password") && msg.includes("pattern")) {
            fieldErrors.password =
              "Password must contain: 8+ characters, uppercase, lowercase, 4+ numbers, and special character";
            setShowPasswordRequirements(true);
          } else if (msg.includes("confirmPassword")) {
            fieldErrors.confirmPassword = "Passwords must match";
          } else if (msg.includes("firstName")) {
            fieldErrors.firstName = msg.includes("empty")
              ? "First name is required"
              : "First name must be 2-50 characters";
          } else if (msg.includes("lastName")) {
            fieldErrors.lastName = msg.includes("empty")
              ? "Last name is required"
              : "Last name must be 2-50 characters";
          }
        });

        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) {
          const firstErrorField = Object.keys(fieldErrors)[0];
          document.getElementsByName(firstErrorField)[0]?.focus();
        }
      } else if (error.response?.data?.error?.message) {
        const message = error.response.data.error.message;

        if (message.includes("Email already registered")) {
          setErrors({
            email:
              "This email is already registered. Please use a different email or login.",
          });
          document.getElementsByName("email")[0]?.focus();
        } else if (message.includes("Validation error")) {
          setGeneralError("Please check all fields and try again");
        } else {
          setGeneralError(message);
        }
      } else {
        setGeneralError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(102,126,234,0.4)",
              }}
            >
              <PersonAddOutlinedIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            Create Account
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Join us and start your career journey today
          </Typography>

          <AnimatePresence>
            {generalError && (
              <MotionAlert
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                severity="error"
                sx={{ mb: 3, borderRadius: 2 }}
                onClose={() => setGeneralError("")}
              >
                {generalError}
              </MotionAlert>
            )}
          </AnimatePresence>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>I am a</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="I am a"
              >
                <MenuItem value="jobseeker">Job Seeker</MenuItem>
                <MenuItem value="employer">Employer</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onFocus={() =>
                formData.password && setShowPasswordRequirements(true)
              }
              onBlur={() =>
                !formData.password && setShowPasswordRequirements(false)
              }
              error={!!errors.password}
              helperText={errors.password}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Collapse in={showPasswordRequirements}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mt: 1,
                  bgcolor: errors.password ? "error.50" : "grey.50",
                  border: "1px solid",
                  borderColor: errors.password ? "error.main" : "grey.300",
                  borderRadius: 2,
                }}
              >
                <Typography variant="caption" fontWeight={600}>
                  Password Requirements:
                </Typography>
                <List dense sx={{ mt: 1 }}>
                  {passwordRequirements.map((req) => {
                    const isMet = req.test(formData.password);
                    return (
                      <ListItem key={req.id} sx={{ py: 0, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          {isMet ? (
                            <CheckCircleOutlineIcon
                              sx={{ fontSize: 18, color: "success.main" }}
                            />
                          ) : (
                            <ErrorOutlineIcon
                              sx={{
                                fontSize: 18,
                                color: errors.password
                                  ? "error.main"
                                  : "grey.400",
                              }}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={req.label}
                          primaryTypographyProps={{
                            variant: "caption",
                            color: isMet ? "success.main" : "text.secondary",
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Collapse>

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <MotionButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<HowToRegIcon />}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </MotionButton>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#667eea",
                    fontWeight: 600,
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
