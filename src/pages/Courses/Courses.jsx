import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [clickedCard, setClickedCard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Map the API data to match your frontend structure
  const mappedCourses = courses.map((course) => ({
    id: course.slug,
    title: course.title,
    category: getCategoryFromSlug(course.slug),
    duration: course.duration,
    price: course.fee,
    featured: isFeaturedCourse(course.slug),
    emoji: getEmojiForCourse(course.slug),
    bgColor: getBgColorForCourse(course.slug),
  }));

  // Helper functions to map API data to your UI structure
  function getCategoryFromSlug(slug) {
    if (slug.includes("door")) return "Security";
    if (slug.includes("cctv")) return "Security";
    if (slug.includes("first-aid")) return "Safety";
    if (slug.includes("fire")) return "Safety";
    if (slug.includes("traffic")) return "Compliance";
    if (slug.includes("personal")) return "Compliance";
    return "Other";
  }

  function isFeaturedCourse(slug) {
    const featuredSlugs = ["door-supervisor", "first-aid", "traffic-marshal"];
    return featuredSlugs.includes(slug);
  }

  function getEmojiForCourse(slug) {
    if (slug.includes("door")) return "🛡️";
    if (slug.includes("cctv")) return "📹";
    if (slug.includes("first-aid")) return "🚑";
    if (slug.includes("fire")) return "🔥";
    if (slug.includes("traffic")) return "🚧";
    if (slug.includes("personal")) return "📜";
    return "🎓";
  }

  function getBgColorForCourse(slug) {
    if (slug.includes("door"))
      return "bg-gradient-to-r from-indigo-500 to-blue-600";
    if (slug.includes("cctv"))
      return "bg-gradient-to-r from-blue-500 to-teal-500";
    if (slug.includes("first-aid"))
      return "bg-gradient-to-r from-red-500 to-orange-500";
    if (slug.includes("fire"))
      return "bg-gradient-to-r from-orange-500 to-yellow-500";
    if (slug.includes("traffic"))
      return "bg-gradient-to-r from-green-500 to-emerald-500";
    if (slug.includes("personal"))
      return "bg-gradient-to-r from-purple-500 to-pink-500";
    return "bg-gradient-to-r from-gray-500 to-gray-600";
  }

  const filteredCourses =
    activeFilter === "All"
      ? mappedCourses
      : mappedCourses.filter((course) => course.category === activeFilter);

  const top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCardClick = (id) => {
    top();
    setClickedCard(id);
    setTimeout(() => setClickedCard(null), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Courses
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#193CB8] text-white py-6 md:py-20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-float-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Professional Training & Certification
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Advance your career with our accredited courses
          </p>
        </div>
      </div>

      {/* Redesigned Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10">
        <div className="bg-white rounded-xl shadow-xl p-6 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Browse Courses
            </h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Security", "Safety", "Compliance"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } flex items-center gap-2`}
                >
                  {filter === "Security" && "🔒"}
                  {filter === "Safety" && "🚨"}
                  {filter === "Compliance" && "📝"}
                  {filter === "All" && "🌟"}
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm animate-fade-in-up">
            <p className="text-xl text-gray-600">
              No courses found in this category. Please try another filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className={`relative group perspective-1000 animate-fade-in-up delay-${
                  (index % 3) * 100 + 200
                }`}
                onMouseEnter={() => setHoveredCard(course.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`absolute inset-0 rounded-xl shadow-2xl transition-all duration-500 ${
                    course.bgColor
                  } ${
                    hoveredCard === course.id
                      ? "opacity-20 blur-md scale-105"
                      : "opacity-0"
                  }`}
                ></div>

                <Link
                  to={`/courses/${course.id}`}
                  onClick={() => handleCardClick(course.id)}
                  className={`block h-full transform-style-preserve-3d transition-all duration-500 ${
                    hoveredCard === course.id ? "rotate-y-6 scale-105" : ""
                  } ${clickedCard === course.id ? "scale-95" : ""}`}
                >
                  <div
                    className={`relative h-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-500 ${
                      hoveredCard === course.id ? "shadow-xl" : ""
                    }`}
                  >
                    {/* Card Header */}
                    <div
                      className={`relative h-48 ${course.bgColor} flex items-center justify-center overflow-hidden transition-all duration-500`}
                    >
                      <span
                        className={`text-7xl transition-all duration-500 ${
                          hoveredCard === course.id ? "scale-110" : ""
                        }`}
                      >
                        {course.emoji}
                      </span>
                      {course.featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-md z-10 transition-all duration-300 group-hover:rotate-6">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-6 relative">
                      <div className="absolute -top-5 left-6 bg-white p-2 rounded-full shadow-md z-10 transition-all duration-300 group-hover:rotate-12">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                          <span className="text-xl">{course.emoji}</span>
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 mt-4 transition-all duration-300 group-hover:text-blue-600">
                        {course.title}
                      </h3>

                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 text-sm flex items-center">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {course.duration}
                        </span>
                        <span className="text-blue-600 font-bold text-lg">
                          {course.price}
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-full transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700">
                          {course.category}
                        </span>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center transition-all duration-300 transform group-hover:translate-x-1">
                          View Details
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes floatIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float-in {
          animation: floatIn 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }

        /* 3D Card Effects */
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-6 {
          transform: rotateY(6deg);
        }

        /* Tailwind doesn't have these by default */
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Courses;
