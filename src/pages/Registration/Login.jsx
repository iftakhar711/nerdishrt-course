import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const Login = () => {
  // Refs for animations
  const containerRef = useRef();
  const buttonRef = useRef();
  const formRef = useRef();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Auth context and routing
  const { login } = useContext(AuthContext);

  const location = useLocation();

  // Check for remembered email on component mount
  useEffect(() => {
    const remember = localStorage.getItem("rememberMe") === "true";
    if (remember) {
      const savedEmail = localStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }

    // Initialize animations
    initAnimations();
  }, []);

  const initAnimations = () => {
    // Container animation (fade in + slide up)
    containerRef.current.style.opacity = 0;
    containerRef.current.style.transform = "translateY(40px)";

    setTimeout(() => {
      containerRef.current.style.transition =
        "opacity 0.8s ease, transform 0.8s ease";
      containerRef.current.style.opacity = 1;
      containerRef.current.style.transform = "translateY(0)";
    }, 100);

    // Form elements staggered animation
    const formElements = formRef.current.querySelectorAll(
      "input, button, label, p"
    );
    formElements.forEach((el, index) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition = `opacity 0.6s ease ${
          index * 0.1
        }s, transform 0.6s ease ${index * 0.1}s`;
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      }, 200 + index * 50);
    });

    // Button pulse animation
    setTimeout(() => {
      buttonRef.current.style.transform = "scale(0.7)";
      buttonRef.current.style.opacity = "0";
      setTimeout(() => {
        buttonRef.current.style.transition =
          "transform 0.4s ease, opacity 0.4s ease";
        buttonRef.current.style.transform = "scale(1)";
        buttonRef.current.style.opacity = "1";
      }, 200);
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://nerdishrt-course-server.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      // Store remembered email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      // Call login function from AuthContext
      await login(data.token, email, rememberMe);

      // Redirect to intended page or profile
      const from = location.state?.from?.pathname || "/profile";
      window.location.replace(from);
    } catch (err) {
      setError(
        err.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#525e75] flex items-center justify-center p-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-md bg-white/20 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/30 z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome Back 👋</h2>
          <p className="text-white/80 mt-2">Sign in to access your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100/80 border border-red-300 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-xs text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-600"
            >
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl px-4 pt-6 pb-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-xs text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-600"
            >
              Password
            </label>
          </div>

          <div className="flex items-center justify-between text-sm text-white">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-white hover:underline hover:text-indigo-200 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={loading}
            className={`w-full bg-[#6a4c93] text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 ${
              loading ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white">
          <p>
            Don't have an account?{" "}
            <Link
              to="/registration"
              className="font-semibold text-indigo-200 hover:text-white hover:underline transition-colors"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
