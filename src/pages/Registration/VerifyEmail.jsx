import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server.onrender.com/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Verification failed");
        }

        setStatus("success");
        setMessage("Email verified successfully! You can now log in.");
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Failed to verify email");
      }
    };

    verifyToken();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div
          className={`text-5xl mb-6 ${
            status === "success" ? "text-green-400" : "text-blue-400"
          }`}
        >
          {status === "verifying" ? "⏳" : status === "success" ? "✓" : "✗"}
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">
          {status === "verifying"
            ? "Verifying Your Email"
            : status === "success"
            ? "Verification Complete!"
            : "Verification Failed"}
        </h2>
        <p className="text-white/80 mb-6">{message}</p>

        {status === "success" && (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        )}

        {status === "error" && (
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
