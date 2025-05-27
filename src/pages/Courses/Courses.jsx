import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCourse, setHoveredCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server.onrender.com/courses"
        );
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

  const top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[350px] overflow-hidden bg-[#525e75]">
        {/* Particle background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-[#6a4c93] to-[#92ba92] opacity-20"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Holographic grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
        linear-gradient(rgba(120, 147, 138, 0.2) 1px, transparent 1px),
        linear-gradient(90deg, rgba(120, 147, 138, 0.2) 1px, transparent 1px)
      `,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />

        {/* Floating 3D card elements */}
        <div className="absolute -right-20 top-1/4 w-64 h-96 rounded-xl bg-gradient-to-br from-[#92ba92]/30 to-[#f1ddbf]/30 backdrop-blur-lg border border-[#92ba92]/20 shadow-2xl transform rotate-12 translate-x-20 opacity-80" />
        <div className="absolute -left-20 bottom-1/4 w-72 h-80 rounded-xl bg-gradient-to-br from-[#78938a]/30 to-[#92ba92]/30 backdrop-blur-lg border border-[#f1ddbf]/20 shadow-2xl transform -rotate-12 -translate-x-20 opacity-80" />

        {/* Main content */}
        <div className="relative h-full flex items-center justify-center px-6">
          <div className="max-w-5xl w-full text-center">
            {/* Badges row */}
            <div className="flex flex-wrap justify-center gap-2 lg:gap-3 mb-3">
              {[
                { icon: "✓", text: "100% Practical Learning" },
                { icon: "★", text: "4.9/5 Satisfaction" },
                { icon: "🕒", text: "Flexible Scheduling" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#6a4c93]/30 to-[#78938a]/30 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-all duration-300"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Headline with animated gradient */}
            <h1 className=" text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight ">
              <span className="block text-white mb-1">Transform Your</span>
              <span
                className="block text-transparent bg-clip-text bg-[length:200%_200%]"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #f1ddbf, #92ba92, #92ba92, #f1ddbf, #f1ddbf)",
                  animation: "gradientFlow 8s ease infinite",
                }}
              >
                Career Path
              </span>
            </h1>

            {/* Paragraph with animated border */}

            <p className="text-sm md:text-lg lg:text-xl font-serif text-white/90 leading-relaxed px-4 py-2">
              Master in-demand skills with our industry-proven curriculum
              designed for real-world success.
            </p>
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-100px) translateX(20px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes borderRotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
      {/* Filters Section with Glass Morphism */}
      <div id="courses" className="py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === category
                    ? "bg-[#6a4c93] text-white shadow-lg"
                    : "bg-white text-[#525e75] hover:bg-gray-100 shadow-md"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards Section */}
      <div className="pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6a4c93] mx-auto"></div>
                <span className="ml-4 text-[#525e75] font-medium">
                  Loading courses...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 max-w-md mx-auto rounded-lg shadow">
              <p className="font-medium">Error loading courses:</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md mx-auto rounded-lg shadow">
              <p className="font-medium">No courses found for this category</p>
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-2 text-sm text-yellow-700 hover:underline"
              >
                View all courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  onMouseEnter={() => setHoveredCourse(course._id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                  className="relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl"
                  style={{
                    transform:
                      hoveredCourse === course._id
                        ? "translateY(-8px)"
                        : "none",
                    background:
                      "linear-gradient(to bottom right, #ffffff, #f9f9f9)",
                  }}
                >
                  {/* Course Image with Overlay */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700"
                      style={{
                        transform:
                          hoveredCourse === course._id
                            ? "scale(1.05)"
                            : "scale(1)",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#525e75] to-transparent opacity-70"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f1ddbf] text-[#525e75]">
                        {course.category || "Professional"}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#525e75] mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.shortDescription ||
                        "Premium professional training course"}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-[#78938a]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {course.duration || "Flexible schedule"}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-[#6a4c93]">
                        £{course.fee}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <Link
                        onClick={top}
                        to={`/courses/${course.slug}`}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#6a4c93] hover:from-[#5a3c83] hover:to-[#678378] shadow-md transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        Enroll Now
                        <svg
                          className="ml-2 -mr-1 w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Hover Ribbon Effect */}
                  <div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f1ddbf] via-[#92ba92] to-[#6a4c93] opacity-0 transition-opacity duration-300"
                    style={{ opacity: hoveredCourse === course._id ? 1 : 0 }}
                  ></div>
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
