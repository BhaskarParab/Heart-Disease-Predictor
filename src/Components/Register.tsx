import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Link,
} from "@mui/material";
import { auth, db } from "../firebase"; // Firebase configuration
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
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

      console.log("User data being sent to Firestore:", {
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        createdAt: new Date().toISOString(),
      });

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        createdAt: new Date().toISOString(),
      });

      // Send email verification to the user
      await sendEmailVerification(user);

      // Log out the user immediately after registration
      await signOut(auth);

      // Proceed with successful registration
      setSuccessMessage("Registration successful.You will be directed to login page.");
      
      setTimeout(() => navigate("/login"), 2000); // Redirect after 3 seconds
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || "Google User",
        email: user.email,
        gender: "Not Specified",
        dob: "Not Specified",
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("token", user.refreshToken);
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
      display="flex"
      flexDirection="row"
      bgcolor="#ffffff"
      height="100vh"
      width="100%"
      maxWidth="100vw"
      overflow="hidden"
      position="relative"
    >
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
          Create your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            placeholder="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            error={touchedFields.username && formData.username.trim() === ""}
            helperText={touchedFields.username && formData.username.trim() === "" ? "Username is required." : ""}
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
            id="email"
            placeholder="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={touchedFields.email && !validateEmail(formData.email)}
            helperText={touchedFields.email && !validateEmail(formData.email) ? "Invalid email address." : ""}
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
            id="password"
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={touchedFields.password && formData.password.trim() === ""}
            helperText={touchedFields.password && formData.password.trim() === "" ? "Password is required." : ""}
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
          <FormControl
            fullWidth
            variant="outlined"
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
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
          >
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
            type="date"
            id="dob"
            InputLabelProps={{ shrink: true }}
            value={formData.dob}
            onChange={handleChange}
            error={touchedFields.dob && formData.dob === ""}
            helperText={touchedFields.dob && formData.dob === "" ? "Date of Birth is required." : ""}
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

          {error && (
            <Alert severity="error" sx={{ mt: 2, bgcolor: "#522222", color: "#ffffff" }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}

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
            Register
          </Button>

          <Typography variant="body2" align="center" mt={2} color="text.secondary">
            Already have an account?{" "}
            <Link href="/login" color="primary" underline="hover">
              Login
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

export default Register;
