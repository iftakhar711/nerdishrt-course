import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Floating course icons animation
  useEffect(() => {
    const icons = [
      "📚",
      "🎓",
      "✏️",
      "📝",
      "🧮",
      "🔬",
      "📊",
      "🧪",
      "📖",
      "🖋️",
      "📐",
      "🧠",
      "💡",
      "🏆",
      "🎯",
      "📈",
      "📉",
      "🔍",
      "📓",
      "📔",
    ];
    const container = containerRef.current;

    const createFloatingIcon = () => {
      const icon = document.createElement("div");
      icon.className = "floating-icon";
      icon.textContent = icons[Math.floor(Math.random() * icons.length)];

      // Random properties
      const size = Math.random() * 24 + 16;
      const posX = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.6 + 0.4;

      icon.style.left = `${posX}%`;
      icon.style.fontSize = `${size}px`;
      icon.style.animationDuration = `${duration}s`;
      icon.style.animationDelay = `${delay}s`;
      icon.style.opacity = opacity;

      container?.appendChild(icon);

      // Remove icon after animation completes
      setTimeout(() => {
        icon.remove();
      }, duration * 1000);
    };

    // Create initial icons
    for (let i = 0; i < 15; i++) {
      createFloatingIcon();
    }

    // Continue creating new icons
    const interval = setInterval(createFloatingIcon, 2000);

    return () => clearInterval(interval);
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful
      console.log("Registration successful:", data);
      navigate("/login"); // Redirect to dashboard on success
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Button hover animation
  const handleButtonHover = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty("--x", `${x}px`);
    button.style.setProperty("--y", `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen z-30 flex items-center justify-center p-4 bg-[#525e75] overflow-hidden relative"
    >
      {/* Floating course icons background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

      {/* Main card */}
      <div className="w-full max-w-[550px] relative z-10">
        {/* Decorative elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500/20 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-500/20 rounded-full filter blur-3xl"></div>

        {/* Registration card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-purple-500/20">
          {/* Animated header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-white">
                Enroll in Our Courses
              </h2>
              <p className="mt-2 text-blue-100">
                Begin your learning journey today
              </p>
            </div>

            {/* Animated progress indicator */}
            <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full animate-progress"
                style={{ width: "75%" }}
              ></div>
            </div>
          </div>

          {/* Form content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm transform transition-all hover:scale-[1.02]">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Name field */}
                <div className="relative group">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                    placeholder="Full Name"
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-3 -top-2.5 px-1 text-xs font-medium text-white/80 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded transition-all duration-300 group-focus-within:-top-2.5 group-focus-within:text-xs"
                  >
                    Full Name
                  </label>
                </div>

                {/* Email field */}
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                    placeholder="Email Address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 -top-2.5 px-1 text-xs font-medium text-white/80 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded transition-all duration-300 group-focus-within:-top-2.5 group-focus-within:text-xs"
                  >
                    Email Address
                  </label>
                </div>

                {/* Password field */}
                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                    placeholder="Password (min 6 characters)"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 -top-2.5 px-1 text-xs font-medium text-white/80 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded transition-all duration-300 group-focus-within:-top-2.5 group-focus-within:text-xs"
                  >
                    Password
                  </label>
                </div>

                {/* Confirm Password field */}
                <div className="relative group">
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/10"
                    placeholder="Confirm Password"
                  />
                  <label
                    htmlFor="confirm-password"
                    className="absolute left-3 -top-2.5 px-1 text-xs font-medium text-white/80 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded transition-all duration-300 group-focus-within:-top-2.5 group-focus-within:text-xs"
                  >
                    Confirm Password
                  </label>
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-white/30 rounded bg-white/5 transition-all duration-200"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-white/80">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-300 hover:text-blue-200 font-medium"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                onMouseMove={handleButtonHover}
                className="w-full py-3 px-6 rounded-xl bg-[#6a4c93] text-white font-medium overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                style={{
                  transform:
                    "perspective(500px) rotateY(var(--rotate-y)) rotateX(var(--rotate-x))",
                }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
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
                      Enrolling...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Enroll Now
                    </>
                  )}
                </span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.3) 0%, transparent 70%)",
                  }}
                ></span>
              </button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                Already enrolled?{" "}
                <Link
                  to="/login"
                  className=" text-blue-500 font-mono font-bold hover:text-blue-200 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .floating-icon {
          position: absolute;
          animation: float linear infinite;
          will-change: transform;
          user-select: none;
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20vh) scale(1.2);
            opacity: 0;
          }
        }

        .animate-progress {
          animation: progress-pulse 2s ease-in-out infinite;
        }

        @keyframes progress-pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default Registration;
