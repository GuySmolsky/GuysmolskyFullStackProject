import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import api from "../services/api";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [resetToken, setResetToken] = useState(token || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage({
        type: "error",
        text: "Password must contain at least 8 characters, one uppercase, one lowercase, 4 numbers, and one special character",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post(`/auth/reset-password/${resetToken}`, { newPassword });
      setMessage({
        type: "success",
        text: "Password reset successful! Redirecting to login...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error?.message || "Failed to reset password",
      });
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            Reset Password
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Enter your reset token and new password
          </Typography>

          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Reset Token"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
              margin="normal"
              helperText="Paste the reset token you received"
            />

            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
