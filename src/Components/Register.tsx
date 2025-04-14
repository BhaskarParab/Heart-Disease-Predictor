import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./Register.css";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  gender?: string;
  dob?: string;
  form?: string; // Added form property
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    let error = "";
    
    switch (name) {
      case "username":
        if (!value.trim()) error = "Username is required";
        else if (value.length < 3) error = "Username must be at least 3 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "dob":
        if (!value) error = "Date of birth is required";
        else {
          const dobDate = new Date(value);
          const today = new Date();
          if (dobDate >= today) error = "Date of birth must be in the past";
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate field when it changes
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage("");
    
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // Save user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        dob: formData.dob,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      });

      // Send email verification
      await sendEmailVerification(user);
      
      // Log out the user immediately after registration
      await signOut(auth);

      // Show success message and redirect
      setSuccessMessage("Registration successful! Please check your email to verify your account. Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      // Handle specific Firebase errors
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "This email is already registered.";
            setErrors(prev => ({ ...prev, email: errorMessage }));
            break;
          case "auth/weak-password":
            errorMessage = "Password should be at least 6 characters.";
            setErrors(prev => ({ ...prev, password: errorMessage }));
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            setErrors(prev => ({ ...prev, email: errorMessage }));
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      setErrors(prev => ({ ...prev, form: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});
      setSuccessMessage("");

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || "Google User",
        email: user.email,
        gender: "Not Specified",
        dob: "Not Specified",
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
      });

      setSuccessMessage("Google registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setErrors({ form: "Google Sign-In failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="webcrumbs">
      <div className="w-[100%] bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl shadow-8x4 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] opacity-5 bg-cover bg-center" />
        <div className="animate-pulse absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-20" />
        <div className="animate-pulse absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-20" />
  
        <div className="flex gap-8 items-center justify-center">
          <div className="w-[500px] bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.gender ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all appearance-none bg-transparent`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.dob ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                  )}
                </div>
  
                {/* Form-level error */}
                {errors.form && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {errors.form}
                  </div>
                )}
                
                {/* Success message */}
                {successMessage && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}
  
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
  
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
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all hover:border-indigo-500 group ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="text-gray-700 group-hover:text-indigo-600">
                    {isSubmitting ? "Processing..." : "Continue with Google"}
                  </span>
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