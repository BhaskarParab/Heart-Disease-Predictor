import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase"; // Import Firebase config and Firestore
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import SecurityIcon from "@mui/icons-material/Security";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // If login is successful, set authentication state and navigate
      console.log("User logged in:", userCredential.user);
      setIsAuthenticated(true);

      // Store login state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userCredential.user));

      navigate("/input"); // Redirect to input page or any other page you prefer
    } catch (error: any) {
      console.error("Error:", error.message);
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null); // Clear previous errors

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save Google user to Firestore
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, {
        username: user.displayName || "Google User",
        email: user.email,
        gender: "Not Specified",
        dob: "Not Specified",
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("token", user.refreshToken); // Save token to localStorage
      // Store login state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/input");
    } catch (err: any) {
      console.error("Error:", err);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      bgcolor="#ffffff"
      height="100vh"
      width="100%"
      maxWidth="100vw"
      overflow="hidden"
      position="relative"
    >
      {/* Left Section */}
      <Box
        flex={1}
        p={4}
        bgcolor="#ffffff"
        display="flex"
        marginBottom="10%"
        flexDirection="column"
        justifyContent="center"
      >
        <Box display="flex" alignItems="center" mb={4}>
          <img
            src="/healthcare.png"
            alt="Logo"
            style={{ width: "30px", height: "30px", marginRight: "12px" }}
          />
          <Typography variant="h5" fontWeight="bold">
            Heartview
          </Typography>
        </Box>

        {/* Features Section */}
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Secure */}
          <Box display="flex" alignItems="flex-start" gap={2}>
            <SecurityIcon />
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Secure
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Secure storage of user information with end-to-end encryption.
              </Typography>
            </Box>
          </Box>

          {/* History Storage */}
          <Box display="flex" alignItems="flex-start" gap={2}>
            <ManageHistoryIcon />
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                History Storage
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Ability to track prediction history for better monitoring of
                heart health trends.
              </Typography>
            </Box>
          </Box>

          {/* Great User Experience */}
          <Box display="flex" alignItems="flex-start" gap={2}>
            <ThumbUpAltIcon />
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Great user experience
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Integrate our product into your routine with an intuitive and
                easy-to-use interface.
              </Typography>
            </Box>
          </Box>

          {/* Innovative Functionality */}
          <Box display="flex" alignItems="flex-start" gap={2}>
            <AutoFixHighIcon />
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Innovative functionality
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Stay ahead with features that set new standards, addressing your
                evolving needs better than the rest.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Section */}
      <Box
        flex={0.5}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="white"
        sx={{
          padding: "2rem",
          borderRadius: "12px",
          margin: "auto",
          width: "100%",
          maxWidth: "400px",
          height: "auto",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
          position: "relative",
          right: 0,
        }}
      >
        <img
          src="/healthcare.png"
          alt="Logo"
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "20px",
            borderRadius: "50%",
          }}
        />
        <Typography component="h2" variant="h6" color="Black" mb={1}>
          Heartview
        </Typography>
        <Typography variant="body1" color="#b3b3b3" mb={4}>
          Login to your account
        </Typography>

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} maxWidth="400px" width="100%">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="Enter your Email"
            name="email"
            type="email"
            InputProps={{
              startAdornment: (
                <Box component="span" mr={1} color="action.active">
                  <i className="fas fa-envelope" />
                </Box>
              ),
            }}
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{
              bgcolor: "background.paper",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7b2dfb",
                },
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder="Password"
            type="password"
            id="password"
            InputProps={{
              endAdornment: (
                <Box component="span" mr={1} color="action.active">
                  <i className="fas fa-eye-slash" />
                </Box>
              ),
            }}
            value={formData.password}
            onChange={handleChange}
            sx={{
              bgcolor: "background.paper",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.87)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7b2dfb",
                },
              },
            }}
          />
          {/* Error Alert */}
          {error && (
            <Box mt={2}>
              <Alert severity="error" sx={{ bgcolor: "#522222", color: "#ffffff" }}>
                {error}
              </Alert>
            </Box>
          )}
          {/* Login Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "#7b2dfb",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "12px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { bgcolor: "#5c1ac9" },
            }}
          >
            Login
          </Button>

          {/* Footer Links */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              sx={{ color: "text.secondary" }}
            />
            <Link href="#" color="primary" underline="hover">
              Forgot Password?
            </Link>
          </Box>
          <Typography variant="body2" align="center" mt={2} color="text.secondary">
            Not a member?{" "}
            <Link href="/register" color="primary" underline="hover">
              Create New Account
            </Link>
          </Typography>
          <Box mt={3} display="flex" alignItems="center">
            <Box flex={1} height="1px" bgcolor="#4f4f4f" />
            <Typography variant="body2" color="#b3b3b3" mx={2}>
              Or continue with
            </Typography>
            <Box flex={1} height="1px" bgcolor="#4f4f4f" />
          </Box>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            sx={{
              mt: 3,
              borderColor: "rgba(0, 0, 0, 0.23)",
              color: "text.primary",
              justifyContent: "center",
              padding: "12px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": { borderColor: "#7b2dfb", bgcolor: "rgba(123, 45, 251, 0.04)" },
            }}
            startIcon={
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                style={{ width: "18px", height: "18px" }}
              />
            }
          >
            Continue with Google
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Login;
