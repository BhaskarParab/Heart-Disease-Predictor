import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAuth,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import "./ForgotPassword.css";
import InputPageNavbar from "../Inputpagenavbar";
import { Box } from "@mui/material";

const ForgotPassword = () => {
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const verifyResetCode = useCallback(
    async (code: string) => {
      try {
        await verifyPasswordResetCode(auth, code);
        setMessage(
          "Reset code is valid. Please enter your new password. Your password must be at least 8 characters long and contain at least one number."
        );
      } catch (error: any) {
        setError("Invalid or expired reset link.");
      }
    },
    [auth]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("oobCode");
    if (code) {
      setOobCode(code);
      verifyResetCode(code);
    }
  }, [location, verifyResetCode]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

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

      // Send password reset email with custom message
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/forgot-password?oobCode={oobCode}`,
        handleCodeInApp: true,
      });

      setMessage(
        "Password reset email sent! Check your inbox. Your new password must be at least 8 characters long and contain at least one number."
      );
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

    // Validate password before submission
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return; // Prevent submission if validation fails
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);

    // Show error immediately if less than 8 chars
    if (value.length > 0 && value.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else if (value.length >= 8 && !/\d/.test(value)) {
      setPasswordError("Password must contain at least one number");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div
      id="webcrumbs"
      className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-indigo-50"
    >
      <div className="w-[100%] min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl shadow-8x4 p-8 relative overflow-hidden">
        {/* Navbar at top */}
        <div>
          <Box>
            <InputPageNavbar title="HeartView" />
          </Box>
        </div>

        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="forgot-password-card bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {oobCode ? "Reset Password" : "Forgot Password?"}
              </h1>
              <p className="text-gray-600">
                {oobCode
                  ? "Enter your new password below:"
                  : "Enter your email to receive a password reset link."}
              </p>
              {oobCode && (
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 8 characters long and contain at
                  least one number
                </p>
              )}
            </div>

            <div className="space-y-6">
              {oobCode ? (
                <>
                  <div className="space-y-4">
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400 group-hover:text-violet-600 transition-colors">
                        lock
                      </span>
                      <input
                        type="password"
                        placeholder="New password (min 8 chars, 1 number)"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        minLength={8} // HTML5 validation as additional safeguard
                      />
                    </div>

                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400 group-hover:text-violet-600 transition-colors">
                        lock_reset
                      </span>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError("");
                        }}
                      />
                    </div>

                    {passwordError && (
                      <div className="text-red-500 text-sm">
                        {passwordError}
                      </div>
                    )}

                    <button
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-violet-600 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400 group-hover:text-violet-600 transition-colors">
                      mail
                    </span>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-violet-600 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                    onClick={handleSendResetEmail}
                  >
                    Send Reset Link
                  </button>
                </>
              )}

              <div className="text-center">
                <button
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => navigate("/login")}
                >
                  <span className="material-symbols-outlined align-middle mr-1 text-sm">
                    arrow_back
                  </span>
                  Back to Login
                </button>
              </div>
            </div>

            {message && (
              <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-blue-500 mr-2">
                    info
                  </span>
                  <p className="text-sm text-blue-700">{message}</p>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-red-500 mr-2">
                    error
                  </span>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
