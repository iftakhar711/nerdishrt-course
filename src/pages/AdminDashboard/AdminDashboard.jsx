import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const navigate = useNavigate();
  const tableRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      navigate("/admin");
    }

    const fetchUsers = async () => {
      try {
        // Add artificial delay to show loading animations
        await new Promise((resolve) => setTimeout(resolve, 800));

        const response = await fetch(
          "https://nerdishrt-course-server.onrender.com/admin/users"
        );
        const data = await response.json();
        if (response.ok) {
          // Animate the data load
          setUsers([]);
          setTimeout(() => {
            setUsers(data.users);
            if (tableRef.current) {
              tableRef.current.style.opacity = 0;
              tableRef.current.style.transform = "translateY(20px)";
              tableRef.current.animate(
                [
                  { opacity: 0, transform: "translateY(20px)" },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                {
                  duration: 600,
                  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                  fill: "forwards",
                }
              );
            }
          }, 100);
        } else {
          setError(data.message || "Failed to fetch users");
        }
      } catch (err) {
        setError(`Failed to connect to server: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    // Animate logout
    document.querySelector(".logout-btn").animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(0.9)", opacity: 0.8 },
        { transform: "scale(1.1)", opacity: 0 },
      ],
      {
        duration: 400,
        easing: "ease-out",
      }
    ).onfinish = () => {
      localStorage.removeItem("adminAuth");
      navigate("/admin");
    };
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "ascending"
        ? a.name?.localeCompare(b.name)
        : b.name?.localeCompare(a.name);
    }
    if (sortConfig.key === "email") {
      return sortConfig.direction === "ascending"
        ? a.email?.localeCompare(b.email)
        : b.email?.localeCompare(a.email);
    }
    if (sortConfig.key === "enrollments") {
      return sortConfig.direction === "ascending"
        ? a.courses?.length - b.courses?.length
        : b.courses?.length - a.courses?.length;
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.courses?.some((course) =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 border-r-blue-500"
            style={{
              animation:
                "spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite",
              background:
                "conic-gradient(from 0deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 80%, rgba(59, 130, 246, 0.5) 100%)",
            }}
          ></div>
          <p className="mt-4 text-white text-lg font-light tracking-wider">
            <span
              className="inline-block"
              style={{
                animation: "pulse 2s infinite",
                animationDelay: "0.2s",
              }}
            >
              L
            </span>
            <span
              className="inline-block"
              style={{
                animation: "pulse 2s infinite",
                animationDelay: "0.4s",
              }}
            >
              o
            </span>
            <span
              className="inline-block"
              style={{
                animation: "pulse 2s infinite",
                animationDelay: "0.6s",
              }}
            >
              a
            </span>
            <span
              className="inline-block"
              style={{
                animation: "pulse 2s infinite",
                animationDelay: "0.8s",
              }}
            >
              d
            </span>
            <span
              className="inline-block"
              style={{
                animation: "pulse 2s infinite",
                animationDelay: "1.0s",
              }}
            >
              i
            </span>
            <span
              className="inline-block"
              style={{
                animation: "pulse 2s infinite",
                animationDelay: "1.2s",
              }}
            >
              n
            </span>
            <span
              className="inline-block"
              style={{
                animation: "pulse 2s infinite",
                animationDelay: "1.4s",
              }}
            >
              g
            </span>
          </p>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div
          className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full text-center"
          style={{
            animation:
              "errorEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            opacity: 0,
            transform: "scale(0.9) translateY(20px)",
          }}
        >
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                animation: "shake 0.5s ease-in-out",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <p className="text-red-400 mb-6 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="relative overflow-hidden bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 group"
          >
            <span className="relative z-10">Retry</span>
            <span
              className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                clipPath: "circle(0% at 50% 50%)",
                transition: "clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            ></span>
          </button>
        </div>
        <style>{`
          @keyframes errorEntrance {
            0% { opacity: 0; transform: scale(0.9) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      style={{
        backgroundImage:
          "radial-gradient(at top right, rgba(236, 253, 245, 0.5) 0%, transparent 50%), radial-gradient(at bottom left, rgba(236, 253, 245, 0.5) 0%, transparent 50%)",
      }}
    >
      {/* Admin Header */}
      <header
        className="bg-white shadow-sm sticky top-0 z-10"
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1
            className="text-2xl font-bold text-gray-900 flex items-center"
            style={{
              background: "linear-gradient(90deg, #3b82f6, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <svg
              className="w-8 h-8 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                animation: "float 3s ease-in-out infinite",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="logout-btn relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 group"
          >
            <span className="relative z-10 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Logout
            </span>
            <span
              className="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                clipPath: "circle(0% at 50% 50%)",
                transition: "clip-path 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            ></span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div
          className="mb-8 bg-white rounded-xl shadow-md p-6"
          style={{
            animation: "fadeInUp 0.6s ease-out forwards",
            opacity: 0,
            transform: "translateY(20px)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users, emails, or courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={sortConfig.key || ""}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="enrollments">Enrollments</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div
          ref={tableRef}
          className="bg-white shadow-lg rounded-xl overflow-hidden"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
          }}
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-xl leading-6 font-semibold text-gray-900">
              User Management
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"} found
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      User {getSortIndicator("name")}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Email {getSortIndicator("email")}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled Courses
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150"
                    onClick={() => handleSort("enrollments")}
                  >
                    <div className="flex items-center">
                      Status {getSortIndicator("enrollments")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                    style={{
                      animation: `fadeInRow 0.4s ease-out forwards`,
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0,
                      transform: "translateY(10px)",
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium"
                          style={{
                            background: `linear-gradient(135deg, ${getRandomGradient(
                              user._id
                            )})`,
                          }}
                        >
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "No name"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Joined:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500">
                        Last active:{" "}
                        {user.lastActive
                          ? new Date(user.lastActive).toLocaleDateString()
                          : "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.courses?.length > 0 ? (
                        <div className="space-y-2">
                          {user.courses.map((course, idx) => (
                            <div
                              key={idx}
                              className="text-sm flex items-start"
                              style={{
                                animation: `fadeIn 0.3s ease-out forwards`,
                                animationDelay: `${index * 0.05 + idx * 0.1}s`,
                                opacity: 0,
                              }}
                            >
                              <span
                                className="inline-block w-2 h-2 rounded-full mt-2 mr-2 flex-shrink-0"
                                style={{
                                  backgroundColor: course.completed
                                    ? "#10B981"
                                    : "#F59E0B",
                                }}
                              ></span>
                              <div>
                                <p className="font-medium">{course.title}</p>
                                <p className="text-xs text-gray-500">
                                  Enrolled:{" "}
                                  {new Date(
                                    course.enrolledAt
                                  ).toLocaleDateString()}
                                  {course.location &&
                                    ` • Location: ${course.location}`}
                                  {course.phone && ` • NO: ${course.phone}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No enrollments
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.courses?.length > 0 ? (
                        user.courses.some((c) => c.completed) ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 animate-pulse">
                            <svg
                              className="w-3 h-3 mr-1 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <svg
                              className="w-3 h-3 mr-1 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            In Progress
                          </span>
                        )
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Not Enrolled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div
            className="mt-12 text-center py-12 bg-white rounded-xl shadow-md"
            style={{
              animation: "fadeIn 0.6s ease-out forwards",
              opacity: 0,
            }}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInRow {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

// Helper function for random gradients
const getRandomGradient = (id) => {
  const colors = [
    "#3B82F6, #6366F1",
    "#10B981, #3B82F6",
    "#F59E0B, #EF4444",
    "#8B5CF6, #EC4899",
    "#EC4899, #F59E0B",
  ];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default AdminDashboard;
