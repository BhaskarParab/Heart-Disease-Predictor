import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
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
      bgcolor="#f7f9fc"
      marginLeft="10px"
      height="100vh"
      width="100vw"
    >
      {/* Left Section */}
      <Box
        flex={1}
        p={4}
        bgcolor="#f7f9fc"
        display="flex"
        marginBottom="10%"
        flexDirection="column"
        justifyContent="center"
      >
        <Box display="flex" alignItems="center" mb={4}>
          <img
            src="/favicon.ico"
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
        px={4}
        marginRight="100px"
        sx={{
          padding: "2rem",
          borderRadius: "8px",
          marginTop: "auto",
          marginBottom: "auto",
          width: "90%",
          maxWidth: "400px",
          height: "auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <img
          src="/favicon.ico"
          alt="Logo"
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "20px",
            borderRadius: "50%",
          }}
        />
        <Typography
          component="h2"
          variant="h6"
          color="Black"
          // fontWeight="bold"
          mb={1}
        >
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
          <Box component="span" mr={1} color="white">
            <i className="fas fa-envelope" />
          </Box>
        ),
      }}
      autoFocus
      value={formData.email}
      onChange={handleChange}
      sx={{
        bgcolor: "white",
        borderRadius: "4px",
        input: { color: "black" },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4f4f4f" },
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
          <Box component="span" mr={1} color="">
            {/* <i className="fas fa-eye-slash" /> */}
          </Box>
        ),
      }}
      value={formData.password}
      onChange={handleChange}
      sx={{
        bgcolor: "white",
        borderRadius: "4px",
        input: { color: "black" },
        // "& .MuiOutlinedInput-notchedOutline": { borderColor: "#4f4f4f" },
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
        bgcolor: "#7b2dfb",
        color: "#ffffff",
        "&:hover": { bgcolor: "#5c1ac9" },
      }}
    >
      Login
    </Button>

    {/* Footer Links */}
    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center" color="#b3b3b3">
      <Typography variant="body2">
        <Box component="span">
          Remember me
        </Box>
      </Typography>
      <Typography variant="body2">
        <Link href="#" color="#b3b3b3" underline="hover">
          Forgot Password?
        </Link>
      </Typography>
    </Box>
    <Typography
      variant="body2"
      align="center"
      mt={2}
      color="#b3b3b3"
    >
      Not a member?{' '}
      <Link href="/register" color="black" underline="hover">
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
            mt: 5,
            borderColor: "#4f4f4f",
            color: "black",
            justifyContent: "flex-start",
            pl: 2,
            marginInline: 10,
            textTransform: "none",
            "&:hover": { borderColor: "#7b2dfb" },
          }}
          startIcon={
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
            />
          }
        >
          Continue with Google
        </Button>
      </Box>
    </Box>
    </Box>
  );
};

export default Login;
