import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAuth,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import "./ForgotPassword.css"; // Import the CSS file

const ForgotPassword = () => {
  const auth = getAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verifyResetCode = useCallback(async (code: string) => {
    try {
      await verifyPasswordResetCode(auth, code);
      setMessage("Reset code is valid. Please enter your new password.");
    } catch (error: any) {
      setError("Invalid or expired reset link.");
    }
  }, [auth]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("oobCode");
    if (code) {
      setOobCode(code);
      verifyResetCode(code);
    }
  }, [location, verifyResetCode]);

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
    <div id="webcrumbs">
      <div className="forgot-password-container w-[100%] font-sans">
        <div className="forgot-password-card bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {oobCode? "Reset Password": "Forgot Password?"}
            </h1>
            <p className="text-gray-600">
              {oobCode
              ? "Enter your new password below:"
              : "Enter your email to receive a password reset link."}
            </p>
          </div>

          <div className="space-y-6">
            {oobCode? (
              <>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="New password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all"
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                </div>
              </>
            ): (
              <>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400">
                    mail
                  </span>
                </div>

                <button
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all"
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
  );
};

export default ForgotPassword;