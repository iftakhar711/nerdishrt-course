// src/Layout/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUsers,
  FiBook,
  FiCalendar,
  FiSettings,
  FiHome,
} from "react-icons/fi";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 space-y-6 bg-indigo-700 px-2 py-7 text-white transition duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center space-x-2 px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-xl font-bold">Admin Panel</span>
        </div>

        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center space-x-3 rounded-lg px-4 py-3 text-white bg-indigo-800"
          >
            <FiHome className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center space-x-3 rounded-lg px-4 py-3 text-white hover:bg-indigo-600 transition-colors"
          >
            <FiUsers className="h-5 w-5" />
            <span>Users</span>
          </a>
          <Link
            to="/dashboard/addcourse"
            className="flex items-center space-x-3 rounded-lg px-4 py-3 text-white hover:bg-indigo-600 transition-colors"
          >
            <FiBook className="h-5 w-5" />
            <span>Courses</span>
          </Link>
          <a
            href="#"
            className="flex items-center space-x-3 rounded-lg px-4 py-3 text-white hover:bg-indigo-600 transition-colors"
          >
            <FiCalendar className="h-5 w-5" />
            <span>Calendar</span>
          </a>
          <Link
            to="/dashboard/courseslist"
            className="flex items-center space-x-3 rounded-lg px-4 py-3 text-white hover:bg-indigo-600 transition-colors"
          >
            <FiSettings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 rounded-lg px-4 py-3 text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            <FiLogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white shadow-sm md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="text-lg font-semibold">Dashboard</div>
            <div className="w-6"></div>
          </div>
        </header>

        {/* Main content outlet */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
