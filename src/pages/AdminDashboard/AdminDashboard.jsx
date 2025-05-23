import { useState, useEffect } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiBook,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server.onrender.com/admin/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        // Assuming the API response has the structure { success: boolean, users: [...] }
        // We need to set the 'users' state to the 'users' array from the response.
        if (data && data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          // Handle cases where the response structure might be unexpected
          setError("API response is not in the expected format.");
          setUsers([]); // Ensure users is an empty array
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Ensure users is an array before sorting
  const sortedUsers = Array.isArray(users)
    ? [...users].sort((a, b) => {
        if (sortConfig.key === "name") {
          return sortConfig.direction === "asc"
            ? a.name?.localeCompare(b.name)
            : b.name?.localeCompare(a.name);
        }
        if (sortConfig.key === "email") {
          return sortConfig.direction === "asc"
            ? a.email?.localeCompare(b.email)
            : b.email?.localeCompare(a.email);
        }
        if (sortConfig.key === "enrollments") {
          return sortConfig.direction === "asc"
            ? (a.courses?.length || 0) - (b.courses?.length || 0)
            : (b.courses?.length || 0) - (a.courses?.length || 0);
        }
        return 0;
      })
    : []; // Provide an empty array if users is not iterable

  // Ensure sortedUsers is an array before filtering
  const filteredUsers = Array.isArray(sortedUsers)
    ? sortedUsers.filter((user) => {
        return (
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.courses?.some((course) =>
            course.title?.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          user.status?.toLowerCase().includes(searchTerm.toLowerCase()) // Added status to filter
        );
      })
    : []; // Provide an empty array if sortedUsers is not iterable

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or course..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
          <p className="text-sm text-gray-500">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "user" : "users"} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    <FiUser className="mr-2" />
                    Name
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <FiChevronUp className="ml-1" />
                      ) : (
                        <FiChevronDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    <FiMail className="mr-2" />
                    Email
                    {sortConfig.key === "email" &&
                      (sortConfig.direction === "asc" ? (
                        <FiChevronUp className="ml-1" />
                      ) : (
                        <FiChevronDown className="ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <FiBook className="mr-2" />
                    Courses
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status {/* Added Status header */}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    {" "}
                    {/* Changed key to user._id */}
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                          {user.name?.charAt(0).toUpperCase() || "U"}{" "}
                          {/* Added toUpperCase() and default */}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Joined:{" "}
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {user.courses?.length > 0 ? (
                        <div className="space-y-1">
                          {user.courses.map((course, idx) => (
                            <div key={idx} className="text-sm">
                              <span
                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                  course.completed
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }`}
                              ></span>
                              {course.title || "Untitled Course"}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No courses
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      {/* Assuming status is a property on the user object */}
                      {user.status === "active" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : user.status === "inactive" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No users found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
