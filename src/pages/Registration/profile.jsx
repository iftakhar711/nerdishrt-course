import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const Profile = () => {
  const { user, logout, refreshUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // Removed hoverStates and related handlers - will use Tailwind hover utilities

  const [activeTab, setActiveTab] = useState("courses");

  // Check authentication state
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Refresh user data on mount
  // Added loading check to prevent refreshing before user is potentially loaded
  useEffect(() => {
    if (!loading && user) {
      refreshUser();
    }
  }, [refreshUser, user, loading]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Using window.location.href as in the original code
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally display an error message to the user
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Removed handleMouseEnter, handleMouseLeave, getAnimatedValue

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        {/* Tailwind spin animation */}
        <div className="w-14 h-14 rounded-full border-4 border-blue-300 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  // --- Not Logged In (handled by useEffect, but good defensive check) ---
  if (!user) {
    return null; // Or a redirecting message
  }

  // --- Profile Content ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 py-10 px-4 sm:px-6 lg:px-8">
      {/* Main content container with max width and centering */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Profile Header with Glass Morphism */}
        <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white border-opacity-10 mb-8 text-center transform transition duration-300 ease-in-out hover:-translate-y-1">
          <div className="flex justify-center mb-6">
            {/* Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl relative overflow-hidden">
              {user.name?.charAt(0).toUpperCase() || "U"}
              {/* Verified Badge */}
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-white shadow-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* User Name (Gradient Text) */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1 bg-clip-text  bg-gradient-to-r from-blue-600 to-violet-700 inline-block">
            {user.name}
          </h1>

          {/* User Email */}
          <p className="text-lg text-slate-600 mb-6">{user.email}</p>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-6 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
                activeTab === "courses"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`px-6 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
                activeTab === "account"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Main Content Area (Courses or Account Settings) */}
        <div className="flex flex-col gap-8">
          {/* Courses Section */}
          {activeTab === "courses" && (
            <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
                Enrolled Courses
              </h2>

              {user.courses?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.courses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
                      // Removed onMouseEnter/onMouseLeave
                    >
                      <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <path d="M22 4L12 14.01l-3-3"></path>
                        </svg>
                        {course.title}
                      </h3>

                      <div className="flex flex-col gap-3 text-slate-600">
                        <div className="flex items-center gap-2">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.65A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          <span>{course.phone || "Not provided"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{course.location || "Not specified"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>
                            {course.date
                              ? new Date(course.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Not set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="text-center py-12 text-slate-600">
                  <div className="w-20 h-20 mx-auto mb-6 text-slate-400 animate-pulse">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    No courses enrolled
                  </h3>
                  <p className="mb-6">
                    You haven't enrolled in any courses yet.
                  </p>
                  <button
                    onClick={() => navigate("/courses")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-700 text-white rounded-full font-semibold transition duration-300 ease-in-out shadow-md shadow-blue-600/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/40"
                  >
                    Browse Available Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Account Settings Section */}
          {activeTab === "account" && (
            <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white border-opacity-10">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2H4.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 1 2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2v-.44a2 2 0 0 0-2-2h-.44a2 2 0 0 1-2-2v-.44a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Account Settings
              </h2>

              <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                {/* Personal Information Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Full Name
                      </label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                        {user.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">
                        Email Address
                      </label>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Security
                  </h3>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full py-3 rounded-lg font-semibold transition duration-300 ease-in-out flex items-center justify-center gap-2
                      ${
                        isLoggingOut
                          ? "bg-slate-200 text-slate-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:opacity-90"
                      }`}
                  >
                    {isLoggingOut ? (
                      <>
                        {/* Tailwind spin animation */}
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                        Signing Out...
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Sign Out
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Removed global style tag for animations */}
    </div>
  );
};

export default Profile;
