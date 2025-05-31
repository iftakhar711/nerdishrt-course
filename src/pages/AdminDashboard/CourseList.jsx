import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server.onrender.com/courses"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data.courses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://nerdishrt-course-server-production.up.railway.app/courses/${courseToDelete.slug}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      // Remove the course from the local state
      setCourses(
        courses.filter((course) => course.slug !== courseToDelete.slug)
      );
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">All Courses</h1>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete "{courseToDelete?.title}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.slug}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className={`h-2 ${course.bgColorClass || "bg-red-500"}`}></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">{course.icon || "✅"}</span>
                <h2 className="text-xl font-semibold text-gray-800">
                  {course.title}
                </h2>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Duration:</span>{" "}
                  {course.duration}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Session:</span> {course.session}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Fee:</span> £{course.fee}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Minimum Age:</span>{" "}
                  {course.minimum_age}
                </p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <Link
                  to={`/courses/${course.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details
                </Link>
                <div className="space-x-2">
                  <Link
                    to={`/dashboard/editcourse/${course.slug}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(course)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
