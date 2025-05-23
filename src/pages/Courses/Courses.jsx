import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import coursesImg from "../../assets/coursesimg.jpeg";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/courses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses =
    activeFilter === "All"
      ? courses
      : courses.filter((course) => course.category === activeFilter);

  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];

  // Icons for different course categories
  const top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-[250px] lg:h-[300px] overflow-hidden bg-indigo-50">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover blur-sm scale-110"
            src={coursesImg}
            alt="Professional Training Courses Background"
          />
          <div className="absolute inset-0 bg-indigo-500 opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl lg:text-5xl">
              <span className="block">Elevate Your Skills</span>
              <span className="block text-indigo-200">Discover Courses</span>
            </h1>
            <p className="mt-3 font-serif font-semibold text-sm lg:text-lg text-black sm:mt-4">
              Explore our curated selection of professional training courses.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="py-8 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === category
                    ? "bg-[#6a4c93] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md mx-auto rounded">
              <p>Error loading courses: {error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md mx-auto rounded">
              <p>No courses found for this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="w-full rounded-xl shadow-lg overflow-hidden relative cursor-pointer snap-start shrink-0 py-6 px-6 bg-white flex flex-col items-center justify-center gap-4 transition-all duration-300 group"
                >
                  {/* Decorative star element */}
                  <div className="absolute -left-[40%] top-0 group-hover:rotate-12 transition-all duration-300 group-hover:scale-150 opacity-30">
                    <div className="flex gap-1">
                      <svg
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="1"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="fill-indigo-300 rotate-[24deg]"
                        height="200"
                        width="200"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                  </div>

                  {/* Category label */}
                  <div className="para uppercase text-center leading-none z-10">
                    <p className="text-black font-semibold text-xs">
                      {course.category || "Professional"}
                    </p>
                    <p className="font-bold text-xl tracking-wider text-gray-700">
                      {course.title}
                    </p>
                  </div>

                  {/* Course icon/image */}

                  <img
                    src={course.imageUrl}
                    className="w-[160px] aspect-square bg-indigo-50 rounded-full flex items-center justify-center text-5xl  z-10"
                    alt=""
                  />

                  {/* Decorative background circle with course icon */}
                  <div className="absolute rounded-full bg-indigo-50 z-0 left-1/2 top-[30%] h-[110%] w-[110%] -translate-x-1/2 group-hover:top-[58%] transition-all duration-300 flex items-center justify-center">
                    <span className="text-[120px] opacity-30 text-indigo-300">
                      {course.icon}
                    </span>
                  </div>

                  {/* Course details */}
                  <div className="w-full flex flex-col gap-2 z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {course.duration || "Flexible"}
                        </span>
                      </div>
                      <span className="font-bold text-indigo-600">
                        £{course.fee}
                      </span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="w-full mt-4 z-10">
                    <Link
                      onClick={top}
                      to={`/courses/${course.slug}`}
                      className="block w-full text-center uppercase font-semibold text-xs px-4 py-2 rounded-full bg-[#6a4c93] text-white hover:bg-[#92ba92] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
