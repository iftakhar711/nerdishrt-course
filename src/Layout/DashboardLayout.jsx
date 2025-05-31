// src/Layout/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiUsers,
  FiBook,
  FiCalendar,
  FiSettings,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navLinks = [
  { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
  { name: "Add Course", icon: <FiBook />, path: "/dashboard/addcourse" },
  { name: "Course List", icon: <FiSettings />, path: "/dashboard/courseslist" },
  { name: "Add Blog", icon: <FiUsers />, path: "/dashboard/addblog" },
  { name: "Blog List", icon: <FiCalendar />, path: "/dashboard/bloglist" },
  { name: "Testimonial", icon: <FiCalendar />, path: "/dashboard/testimonial" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-transparent bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-[#525E75] text-white transform transition-transform duration-300 md:translate-x-0 md:relative ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <FiHome className="h-7 w-7" />
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-4 space-y-2 mt-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === link.path
                  ? "bg-indigo-700 font-semibold"
                  : "hover:bg-indigo-600"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 py-3 font-semibold transition-colors"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-md px-4 py-4 flex items-center justify-between md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu className="h-6 w-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <div className="w-6"></div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
