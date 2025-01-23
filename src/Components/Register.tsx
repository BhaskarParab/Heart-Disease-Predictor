import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link as MuiLink,
  Alert,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { auth, db } from "../firebase"; // Firebase configuration
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    password: string;
    gender: string;
    dob: string;
  }>({
    username: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setTouchedFields((prevState) => ({ ...prevState, [name]: true }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setTouchedFields((prevState) => ({ ...prevState, [name]: true }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const { username, email, password, gender, dob } = formData;
    return (
      username.trim() !== "" &&
      validateEmail(email) &&
      password.trim() !== "" &&
      gender !== "" &&
      dob !== ""
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!validateForm()) {
      setError("Please fill out all fields correctly.");
      return;
    }
  
    try {
      setError(null); // Clear previous errors
  
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      // Log the data to verify it's correct
      console.log("User data being sent to Firestore:", {
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        createdAt: new Date().toISOString(),
      });
  
      // Save user details to Firestore
      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, {
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        createdAt: new Date().toISOString(),
      });
  
      // Send email verification to the user
      await sendEmailVerification(user);
  
      // Proceed with successful registration
      setSuccessMessage("Registration successful. A verification email has been sent. Please verify your email before logging in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Registration failed. Please try again.");
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

  //     const data = await Response.json();

  //     if (Response.ok) {
  //       localStorage.setItem("token", user.refreshToken); // Save token to localStorage
  //       navigate("/input");
  //     } else {
  //       setError(data?.msg || "Google Sign-In failed. Please try again.");
  //     }
  //   } catch (err: any) {
  //     console.error("Error:", err);
  //     setError("Google Sign-In failed. Please try again.");
  //   }
  // };

  return (
    <Box
      sx={{
        backgroundColor: "#f7f9fc",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Email and Password Registration Fields */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            error={touchedFields.username && formData.username.trim() === ""}
            helperText={
              touchedFields.username && formData.username.trim() === "" ? "Username is required." : ""
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={touchedFields.email && !validateEmail(formData.email)}
            helperText={
              touchedFields.email && !validateEmail(formData.email)
                ? "Invalid email address."
                : ""
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={touchedFields.password && formData.password.trim() === ""}
            helperText={
              touchedFields.password && formData.password.trim() === ""
                ? "Password is required."
                : ""
            }
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
              label="Gender"
              required
              error={touchedFields.gender && formData.gender === ""}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="dob"
            label="Date of Birth"
            type="date"
            id="dob"
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleChange}
            error={touchedFields.dob && formData.dob === ""}
            helperText={
              touchedFields.dob && formData.dob === "" ? "Date of Birth is required." : ""
            }
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>
        </Box>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          sx={{ mt: 1 }}
          onClick={handleGoogleSignIn}
        >
          Login with Google
        </Button>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <MuiLink href="/login" sx={{ textDecoration: "none" }}>
            Login
          </MuiLink>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;
