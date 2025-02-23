import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../firebase";
import './Login.css';

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
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
    <div id="webcrumbs" className="login-container"> {/* Added id and class */}
    <div className="w-[0px] min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 font-sans">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="animate-pulse absolute top-1/4 left-1/4 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-20" />
        <div className="animate-pulse absolute top-1/2 right-1/4 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-20" />
        <div className="animate-bounce absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-20" />
      </div>

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
              { icon: "security", title: "Secure", desc: "Secure storage of user information with end-to-end encryption" },
              { icon: "history", title: "History Storage", desc: "Track prediction history for better monitoring of heart health trends" },
              { icon: "thumb_up", title: "Great User Experience", desc: "Intuitive and easy-to-use interface for seamless integration" },
              { icon: "auto_awesome", title: "Innovative Functionality", desc: "Stay ahead with features that set new standards" }
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
          <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300">
            <div className="text-center mb-10">
              <img 
                src="/healthcare.png" 
                alt="Logo" 
                className="w-24 h-24 mx-auto mb-6 rounded-full shadow-xl hover:shadow-2xl hover:rotate-12 transition-all duration-300" 
              />
              <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Welcome Back
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
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200 transition-all duration-300"
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
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-200 transition-all duration-300"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

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
                <Link to="/forgot-password" className="text-sm text-violet-600 hover:text-violet-800 hover:underline transition-all">
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
                <span className="text-sm text-gray-500">or continue with</span>
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
                <a href="/register" className="text-violet-600 hover:text-violet-800 hover:underline ml-2 transition-colors">
                  Create an account
                </a>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
    </div>
  );
};

export default Login;