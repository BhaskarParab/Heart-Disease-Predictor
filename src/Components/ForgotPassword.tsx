import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAuth,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { TextField, Button, Card, Typography, Container, Box, Alert } from "@mui/material";

const ForgotPassword = () => {
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Wrap verifyResetCode in useCallback to avoid recreating it on every render
  const verifyResetCode = useCallback(async (code: string) => {
    try {
      await verifyPasswordResetCode(auth, code);
      setMessage("Reset code is valid. Please enter your new password.");
    } catch (error: any) {
      setError("Invalid or expired reset link.");
    }
  }, [auth]); // auth is a stable dependency

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("oobCode");
    if (code) {
      setOobCode(code);
      verifyResetCode(code); // Now safe to use inside useEffect
    }
  }, [location, verifyResetCode]); // Added verifyResetCode as a dependency

  const handleSendResetEmail = async () => {
    if (!email) {
      setError("Please enter an email address.");
      return;
    }
  
    try {
      // Check if the email exists using the FastAPI backend
      const response = await fetch(`http://localhost:8000/check-user/${email}`);
      
      if (!response.ok) {
        throw new Error("User not found");
      }
  
      // If user exists, send reset email
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (error: any) {
      if (error.message === "User not found") {
        setError("No account found with this email.");
      } else {
        setError("An error occurred. Please try again.");
      }
      setMessage("");
    }
  };
  

  const handleResetPassword = async () => {
    if (!oobCode) {
      setError("Invalid reset link.");
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ padding: 4, textAlign: "center", mt: 5, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          {oobCode ? "Reset Password" : "Forgot Password?"}
        </Typography>

        {oobCode ? (
          <>
            <Typography>Enter your new password below:</Typography>
            <TextField
              type="password"
              label="New Password"
              fullWidth
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleResetPassword}>
              Reset Password
            </Button>
          </>
        ) : (
          <>
            <Typography>Enter your email, and we’ll send you a reset link.</Typography>
            <TextField
              type="email"
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleSendResetEmail}>
              Send Reset Email
            </Button>
          </>
        )}

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ mt: 3 }}>
          <Button variant="outlined" fullWidth onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
