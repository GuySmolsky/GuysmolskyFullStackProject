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
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginIcon from "@mui/icons-material/Login";
import EmailIcon from "@mui/icons-material/Email";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const MotionPaper = motion(Paper);
const MotionAlert = motion(Alert);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
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
      const result = await login(formData.email, formData.password);

      if (result.success) {
        navigate("/", { replace: true });
      } else {
        const errorMessage = result.error || "";

        if (
          errorMessage.toLowerCase().includes("email not found") ||
          errorMessage.toLowerCase().includes("user not found") ||
          errorMessage.toLowerCase().includes("no user")
        ) {
          setErrors({
            email: "No account found with this email address",
          });
          setGeneralError("The email address you entered is not registered.");
          document.getElementsByName("email")[0]?.focus();
        } else if (
          errorMessage.toLowerCase().includes("wrong password") ||
          errorMessage.toLowerCase().includes("incorrect password") ||
          errorMessage.toLowerCase().includes("password incorrect")
        ) {
          setErrors({
            password: "Incorrect password. Please try again.",
          });
          setGeneralError("The password you entered is incorrect.");
          document.getElementsByName("password")[0]?.focus();
        } else if (errorMessage.includes("Invalid credentials")) {
          setGeneralError(
            "Invalid email or password. Please check your credentials and try again."
          );
          setErrors({
            email: "Check your email address",
            password: "Check your password",
          });
        } else if (
          errorMessage.includes("Account deactivated") ||
          errorMessage.includes("account is disabled")
        ) {
          setGeneralError(
            "Your account has been deactivated. Please contact support for assistance."
          );
        } else if (errorMessage.includes("Account locked")) {
          setGeneralError(
            "Your account has been temporarily locked due to too many failed attempts. Please try again later."
          );
        } else {
          setGeneralError(
            errorMessage ||
              "Login failed. Please check your email and password."
          );
          setErrors({
            email: "Verify your email address",
            password: "Verify your password",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setGeneralError("Unable to login. Please try again later.");
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
      <Container maxWidth="sm">
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
              <LockOutlinedIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Sign in to continue to your account
          </Typography>

          <AnimatePresence mode="wait">
            {generalError && (
              <MotionAlert
                key="error-alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                severity="error"
                icon={<ErrorOutlineIcon />}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(244,67,54,0.2)",
                }}
                onClose={() => setGeneralError("")}
              >
                {generalError}
              </MotionAlert>
            )}
          </AnimatePresence>

          <Box component="div">
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email || ""}
              required
              margin="normal"
              autoComplete="email"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementsByName("password")[0]?.focus();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color={errors.email ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                sx: {
                  fontWeight: errors.email ? 500 : 400,
                  fontSize: "0.8rem",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    animation: errors.email ? "shake 0.3s" : "none",
                  },
                },
                "& .MuiFormHelperText-root.Mui-error": {
                  color: "#d32f2f",
                },
                "@keyframes shake": {
                  "0%, 100%": { transform: "translateX(0)" },
                  "25%": { transform: "translateX(-5px)" },
                  "75%": { transform: "translateX(5px)" },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || ""}
              required
              margin="normal"
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon
                      color={errors.password ? "error" : "action"}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                sx: {
                  fontWeight: errors.password ? 500 : 400,
                  fontSize: "0.8rem",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    animation: errors.password ? "shake 0.3s" : "none",
                  },
                },
                "& .MuiFormHelperText-root.Mui-error": {
                  color: "#d32f2f",
                },
              }}
            />

            <Box sx={{ textAlign: "right", mt: 1, mb: 3 }}>
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: "#667eea",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="button"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={<LoginIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                  background:
                    "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "#667eea",
                    fontWeight: 600,
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default LoginPage;
