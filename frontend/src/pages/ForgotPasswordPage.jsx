import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyIcon from "@mui/icons-material/Key";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

const MotionPaper = motion(Paper);
const MotionButton = motion(Button);
const MotionAlert = motion(Alert);
const MotionBox = motion(Box);

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setEmailError("");

    try {
      const response = await api.post("/auth/request-password-reset", {
        email,
      });
      setResetToken(response.data.data.resetToken);
      setSuccess("Password reset instructions sent! Check your email.");
    } catch (error) {
      const message = error.response?.data?.error?.message || "";

      if (
        message.toLowerCase().includes("not found") ||
        message.toLowerCase().includes("no user") ||
        error.response?.status === 404
      ) {
        setEmailError("No account found with this email address");
        setError("This email is not registered in our system.");
      } else {
        setError(
          message || "Failed to request password reset. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(e);
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
              <LockResetIcon sx={{ fontSize: 40, color: "white" }} />
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            Forgot Password
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Enter your email to receive password reset instructions
          </Typography>

          <AnimatePresence mode="wait">
            {error && (
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
                onClose={() => setError("")}
              >
                {error}
              </MotionAlert>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {success && !resetToken && (
              <MotionAlert
                key="success-alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                severity="success"
                icon={<CheckCircleOutlineIcon />}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(76,175,80,0.2)",
                }}
                onClose={() => setSuccess("")}
              >
                {success}
              </MotionAlert>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {resetToken && (
              <MotionBox
                key="reset-token-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="info"
                  icon={<InfoOutlinedIcon />}
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(33,150,243,0.2)",
                  }}
                >
                  <Typography variant="body2" fontWeight={500}>
                    Password reset token generated successfully!
                  </Typography>
                </Alert>
                <MotionButton
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={`/reset-password/${resetToken}`}
                  startIcon={<KeyIcon />}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    mb: 3,
                    py: 1.5,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                  }}
                >
                  Click Here to Reset Password
                </MotionButton>
              </MotionBox>
            )}
          </AnimatePresence>

          <Box component="div">
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={!!emailError}
              helperText={emailError || ""}
              required
              margin="normal"
              autoComplete="email"
              autoFocus
              disabled={!!resetToken}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !resetToken) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color={emailError ? "error" : "action"} />
                  </InputAdornment>
                ),
              }}
              FormHelperTextProps={{
                sx: {
                  fontWeight: emailError ? 500 : 400,
                  fontSize: "0.8rem",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-error": {
                    animation: emailError ? "shake 0.3s" : "none",
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

            {!resetToken && (
              <MotionButton
                type="button"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<SendIcon />}
                onClick={handleButtonClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                }}
              >
                {loading ? "Sending..." : "Send Reset Instructions"}
              </MotionButton>
            )}

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "#667eea",
                    fontWeight: 600,
                  }}
                >
                  Login here
                </Link>
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
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

export default ForgotPasswordPage;
