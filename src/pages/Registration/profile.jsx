import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const Profile = () => {
  const { user, logout, refreshUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hoverStates, setHoverStates] = useState({});
  const [activeTab, setActiveTab] = useState("courses");

  // Check authentication state
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Refresh user data on mount
  useEffect(() => {
    if (user) refreshUser();
  }, [refreshUser, user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMouseEnter = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  const getAnimatedValue = (id, property, from, to) => {
    return hoverStates[id]
      ? { [property]: to, transition: "all 0.3s ease-in-out" }
      : { [property]: from, transition: "all 0.3s ease-in-out" };
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "5px solid rgba(59, 130, 246, 0.2)",
            borderTopColor: "#3b82f6",
            animation: "spin 1s linear infinite",
            transformOrigin: "center",
          }}
        ></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      {/* Animated background elements */}
      {/* <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${Math.random() * 100 + 100}px`,
              height: `${Math.random() * 100 + 100}px`,
              borderRadius: "50%",
              background: `rgba(59, 130, 246, ${Math.random() * 0.05 + 0.02})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translate(-50%, -50%)`,
              filter: "blur(40px)",
              animation: `float ${
                Math.random() * 20 + 10
              }s infinite alternate ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div> */}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Profile Header with Glass Morphism */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            marginBottom: "2rem",
            textAlign: "center",
            transform: "translateY(0)",
            transition: "transform 0.3s ease",
            ":hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "3rem",
                fontWeight: "bold",
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  background: "#10b981",
                  color: "white",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "3px solid white",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
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

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "0.5rem",
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            {user.name}
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              color: "#64748b",
              marginBottom: "1.5rem",
            }}
          >
            {user.email}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => setActiveTab("courses")}
              style={{
                padding: "0.5rem 1.5rem",
                background:
                  activeTab === "courses"
                    ? "#3b82f6"
                    : "rgba(59, 130, 246, 0.1)",
                color: activeTab === "courses" ? "white" : "#3b82f6",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  activeTab === "courses"
                    ? "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
                    : "none",
              }}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab("account")}
              style={{
                padding: "0.5rem 1.5rem",
                background:
                  activeTab === "account"
                    ? "#3b82f6"
                    : "rgba(59, 130, 246, 0.1)",
                color: activeTab === "account" ? "white" : "#3b82f6",
                borderRadius: "50px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow:
                  activeTab === "account"
                    ? "0 4px 6px -1px rgba(59, 130, 246, 0.3)"
                    : "none",
              }}
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexDirection: "column",
          }}
        >
          {/* Courses Section */}
          {activeTab === "courses" && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Enrolled Courses
              </h2>

              {user.courses?.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {user.courses.map((course) => (
                    <div
                      key={course._id}
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "1.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                        transition: "all 0.3s ease",
                        ...getAnimatedValue(
                          course._id,
                          "transform",
                          "scale(1)",
                          "scale(1.02)"
                        ),
                        ...getAnimatedValue(
                          course._id,
                          "boxShadow",
                          "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                          "0 10px 15px -3px rgba(59, 130, 246, 0.2))"
                        ),
                      }}
                      onMouseEnter={() => handleMouseEnter(course._id)}
                      onMouseLeave={() => handleMouseLeave(course._id)}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          color: "#1e293b",
                          marginBottom: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course.title}
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                          color: "#64748b",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{course.phone || "Not provided"}</span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{course.location || "Not specified"}</span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 0",
                    color: "#64748b",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      margin: "0 auto 1.5rem",
                      color: "#cbd5e1",
                      animation: "pulse 2s infinite ease-in-out",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#334155",
                      marginBottom: "0.5rem",
                    }}
                  >
                    No courses enrolled
                  </h3>
                  <p style={{ marginBottom: "1.5rem" }}>
                    You haven't enrolled in any courses yet
                  </p>
                  <button
                    onClick={() => navigate("/courses")}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "linear-gradient(90deg, #3b82f6, #6366f1)",
                      color: "white",
                      borderRadius: "50px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                      ":hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.4)",
                      },
                    }}
                  >
                    Browse Available Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Account Settings Section */}
          {activeTab === "account" && (
            <div
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account Settings
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1.5rem",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "1rem",
                    }}
                  >
                    Personal Information
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Full Name
                      </label>
                      <div
                        style={{
                          padding: "0.75rem",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          color: "#334155",
                        }}
                      >
                        {user.name}
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          color: "#64748b",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Email Address
                      </label>
                      <div
                        style={{
                          padding: "0.75rem",
                          background: "#f8fafc",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          color: "#334155",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      marginBottom: "1rem",
                    }}
                  >
                    Security
                  </h3>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: isLoggingOut
                        ? "#f1f5f9"
                        : "linear-gradient(90deg, #ef4444, #dc2626)",
                      color: isLoggingOut ? "#64748b" : "white",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {isLoggingOut ? (
                      <>
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid rgba(100, 116, 139, 0.2)",
                            borderTopColor: "#64748b",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
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
                        >
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

      {/* Global Animation Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          from { transform: translate(-50%, -50%); }
          to { transform: translate(-50%, calc(-50% - 20px)); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
