import React, { useState } from "react";
import { FaceFrownIcon, RocketLaunchIcon } from "@heroicons/react/24/outline"; // Using Heroicons v2.2.1

// 404 Not Found Component
export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-fade-in font-inter text-gray-900 dark:text-gray-100">
      {/* Ghost Icon replaced with Face Frown Icon */}
      <FaceFrownIcon className="text-red-500 w-32 h-32 mb-8 animate-bounce-slow" />

      {/* Main Heading */}
      <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-gray-800 dark:text-gray-200 mb-4 tracking-tight">
        404
      </h1>

      {/* Sub-heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-6 text-center">
        Oops! Page Not Found
      </h2>

      {/* Description */}
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
        The page you're looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Call to Action Button */}
      <a
        href="/" // Link to the homepage
        className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-75 text-lg"
      >
        Go to Homepage
        <svg
          className="ml-3 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </a>
    </div>
  );
}

// Coming Soon Component
export function ComingSoon() {
  // State for email input (optional, for demonstration)
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this email to your backend
    console.log("Email submitted for notification:", email);
    // Using a custom modal message instead of alert()
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    messageBox.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Thank You!</h3>
        <p class="text-gray-700 dark:text-gray-300 mb-6">We will notify you when we launch.</p>
        <button id="closeMessageBox" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out">Close</button>
      </div>
    `;
    document.body.appendChild(messageBox);

    document.getElementById("closeMessageBox").addEventListener("click", () => {
      document.body.removeChild(messageBox);
    });

    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl transform rotate-3 scale-95 transition-all duration-500 ease-in-out hover:rotate-0 hover:scale-100 animate-fade-in font-inter text-white">
      {/* Rocket Icon replaced with Rocket Launch Icon */}
      <RocketLaunchIcon className="text-white w-32 h-32 mb-8 animate-float" />

      {/* Main Heading */}
      <h1 className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-white mb-4 tracking-tight text-shadow-lg">
        Coming Soon!
      </h1>

      {/* Sub-heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-white text-opacity-90 mb-6 text-center">
        We're building something amazing!
      </h2>

      {/* Description */}
      <p className="text-lg text-white text-opacity-80 mb-8 text-center max-w-md">
        Get ready for an incredible experience. We're working hard to bring you
        something truly special.
      </p>

      {/* Email Subscription Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col sm:flex-row gap-4"
      >
        <input
          type="email"
          placeholder="Enter your email to get notified"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-grow p-4 rounded-full border-2 border-white border-opacity-50 bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition duration-300 text-lg"
          required
        />
        <button
          type="submit"
          className="px-8 py-4 bg-white text-purple-700 font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-75 text-lg"
        >
          Notify Me
        </button>
      </form>

      {/* Optional: Social Media Links Placeholder */}
      <div className="mt-10 text-white text-opacity-70 text-sm">
        Follow us for updates: [Social Media Icons Placeholder]
      </div>
    </div>
  );
}

export default {
  NotFound,
  ComingSoon,
};
