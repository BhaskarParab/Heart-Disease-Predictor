import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Firebase configuration
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Register.css"; // Import the CSS file


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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
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
      setSuccessMessage("Registration successful. You will be directed to the login page.");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
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
      navigate("/");
    } catch (err: any) {
      console.error("Error:", err);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div id="webcrumbs">
      <div className="w-[100%] bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] opacity-5 bg-cover bg-center" />
        <div className="animate-pulse absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-20" />
        <div className="animate-pulse absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-20" />
  
        <div className="flex gap-8 items-center justify-center">
          <div className="w-[500px] bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
            <div className="relative">
              <div className="flex flex-col items-center mb-8">
                <img
                  src="/healthcare.png"
                  alt="Logo"
                  className="w-24 h-24 mx-auto mb-6 rounded-full shadow-xl hover:shadow-2xl hover:rotate-12 transition-all duration-300"
                />
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Create Account
                </h2>
                <p className="text-gray-500">Join our healthcare community</p>
              </div>
  
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Username Field */}
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                    person
                  </span>
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
  
                {/* Email Field */}
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
  
                {/* Password Field */}
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                    lock
                  </span>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
  
                {/* Gender Field */}
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                    wc
                  </span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleSelectChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
  
                {/* Date of Birth Field */}
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors">
                    calendar_today
                  </span>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  />
                </div>
  
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  Register
                </button>
  
                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}
  
                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-gray-500">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
  
                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all hover:border-indigo-500 group"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="text-gray-700 group-hover:text-indigo-600">Continue with Google</span>
                </button>
  
                {/* Login Link */}
                <p className="text-center text-gray-600 mt-6">
                  Already have an account?
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 font-medium ml-2 transition-colors hover:underline"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;