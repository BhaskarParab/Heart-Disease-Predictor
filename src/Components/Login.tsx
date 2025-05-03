import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import "./Login.css";
import InputPageNavbar from "../Inputpagenavbar";

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
  });

  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPasswordRequirements({
        length: value.length >= 8,
        number: /[0-9]/.test(value),
      });
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = () => {
    return passwordRequirements.length && passwordRequirements.number;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword()) {
      setError("Password doesn't meet requirements");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      navigate("/");
    } catch (error: any) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
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

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err: any) {
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <>
      <div id="webcrumbs" className="login-container">
        {" "}
        {/* Added id and class */}
        <div className="w-[100%] bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl shadow-8x4 p-8 relative overflow-hidden">
          <InputPageNavbar title="HeartView" />

          <main className="flex min-h-screen backdrop-blur-sm">
            {/* Left Section */}
            <section className="w-3/5 p-12 flex flex-col justify-center relative">
              <div className="mb-12 flex items-center gap-4 animate-fade-in hover:translate-x-2 transition-all duration-300">
                <img
                  src="/healthcare.png"
                  alt="Heartview"
                  className="w-12 h-12 transform hover:rotate-45 hover:scale-110 transition-all duration-300"
                />
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-600 transition-all duration-300">
                  Welcome to Heartview
                </h1>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: "security",
                    title: "Secure",
                    desc: "Secure storage of user information with end-to-end encryption",
                  },
                  {
                    icon: "history",
                    title: "History Storage",
                    desc: "Track prediction history for better monitoring of heart health trends",
                  },
                  {
                    icon: "thumb_up",
                    title: "Great User Experience",
                    desc: "Intuitive and easy-to-use interface for seamless integration",
                  },
                  {
                    icon: "auto_awesome",
                    title: "Innovative Functionality",
                    desc: "Stay ahead with features that set new standards",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 rounded-2xl hover:bg-white/70 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-4xl text-violet-600 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      {feature.icon}
                    </span>
                    <div className="group-hover:translate-x-2 transition-all duration-300">
                      <h3 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Right Section */}
            <section className="w-2/5 p-12 flex items-center">
              <div className="w-full max-w-md bg-white/90 rounded-3xl p-10 shadow-2xl hover:shadow-3xl  transition-all duration-300">
                <div className="text-center mb-10">
                  <img
                    src="/healthcare.png"
                    alt="Logo"
                    className="w-24 h-24 mx-auto mb-6 rounded-full shadow-xl hover:shadow-2xl hover:rotate-12 transition-all duration-300"
                  />
                  <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                    Sign in
                  </h2>
                  <p className="text-gray-600">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="text-red-600 text-sm p-3 bg-red-100 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400 group-hover:text-violet-600 transition-colors">
                      mail
                    </span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400 group-hover:text-violet-600 transition-colors">
                      lock
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <span
                      className="material-symbols-outlined absolute right-3 top-3.5 text-gray-400 hover:text-violet-600 cursor-pointer transition-colors"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>

                  {/* Password Requirements - Moved outside the input container */}
                  {formData.password && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 transition-all duration-300">
                      <p className="font-medium mb-1">Password must contain:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <div
                          className={`flex items-center ${
                            passwordRequirements.length ? "text-green-600" : ""
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm mr-1">
                            {passwordRequirements.length
                              ? "check_circle"
                              : "radio_button_unchecked"}
                          </span>
                          8+ characters
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordRequirements.number ? "text-green-600" : ""
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm mr-1">
                            {passwordRequirements.number
                              ? "check_circle"
                              : "radio_button_unchecked"}
                          </span>
                          any number
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded-lg text-violet-600 focus:ring-violet-500 transition-colors"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-violet-600 hover:text-violet-800 hover:underline transition-all"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-indigo-600 hover:to-violet-600 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                  >
                    Sign in
                  </button>

                  <div className="relative flex items-center gap-4 my-8">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-500">
                      or continue with
                    </span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-4 px-6 rounded-xl border-2 border-gray-200 flex items-center justify-center gap-4 hover:bg-gray-50 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      className="w-6 h-6"
                    />
                    <span className="font-medium">Continue with Google</span>
                  </button>

                  <p className="text-center text-sm text-gray-600 mt-8">
                    Not registered yet?
                    <a
                      href="/register"
                      className="text-violet-600 hover:text-violet-800 hover:underline ml-2 transition-colors"
                    >
                      Create an account
                    </a>
                  </p>
                </form>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Login;
