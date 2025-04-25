import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUserData } = useContext(AuthContext);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    date: "",
  });
  const iconRef = useRef(null);
  const modalRef = useRef(null);

  const locations = [
    "BARKING",
    "SOUTHALL",
    "UPMINSTER",
    "WIMBLEDON",
    "WOOLWICH",
    "CROYDON",
    "HARROW",
    "HOUNSLOW",
    "SURREY",
    "ENFIELD",
    "WEMBLEY",
    "LEWISHAM",
    "ILFORD",
    "WOODGREEN",
    "STOCKWELL",
    "HAMMERSMITH",
    "BOW",
    "BETHNAL GREEN",
  ];

  const getCourseIcon = () => {
    if (slug.includes("door")) return "🛡️";
    if (slug.includes("cctv")) return "📹";
    if (slug.includes("first-aid")) return "🚑";
    if (slug.includes("fire")) return "🔥";
    if (slug.includes("traffic")) return "🚧";
    if (slug.includes("personal")) return "📜";
    return "🎓";
  };

  const animateIcon = () => {
    if (iconRef.current) {
      iconRef.current.style.transform = "scale(1.1)";
      iconRef.current.style.transition =
        "transform 0.3s ease, rotate 0.5s ease";

      setTimeout(() => {
        if (iconRef.current) {
          iconRef.current.style.transform = "scale(1)";
          iconRef.current.style.rotate = "5deg";
        }
      }, 300);

      setTimeout(() => {
        if (iconRef.current) {
          iconRef.current.style.rotate = "0deg";
        }
      }, 800);
    }
  };

  const animateModalIn = () => {
    if (modalRef.current) {
      modalRef.current.style.opacity = "0";
      modalRef.current.style.transform = "translateY(20px)";
      modalRef.current.style.transition =
        "opacity 0.3s ease, transform 0.3s ease";

      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.style.opacity = "1";
          modalRef.current.style.transform = "translateY(0)";
        }
      }, 10);
    }
  };

  const animateModalOut = (callback) => {
    if (modalRef.current) {
      modalRef.current.style.opacity = "0";
      modalRef.current.style.transform = "translateY(20px)";

      setTimeout(() => {
        callback();
      }, 300);
    } else {
      callback();
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `https://nerdishrt-course-server.onrender.com/courses/${slug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourse(data.course);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (user?.courses) {
      const enrolled = user.courses.some((c) => c.slug === slug);
      setIsEnrolled(enrolled);
    }
  }, [user, slug]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showEnrollModal || showLoginPrompt) {
      animateModalIn();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showEnrollModal, showLoginPrompt]);

  const handleEnrollClick = () => {
    animateIcon();
    if (isAuthenticated()) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: "",
        date: "",
      });
      setShowEnrollModal(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: `/courses/${slug}` } });
  };

  const closeModals = () => {
    animateModalOut(() => {
      setShowEnrollModal(false);
      setShowLoginPrompt(false);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://nerdishrt-course-server.onrender.com/enroll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userEmail: user.email,
            courseSlug: slug,
            phone: formData.phone, // Changed from number to phone
            location: formData.location,
            date: formData.date,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsEnrolled(true);
        closeModals();
        await refreshUserData();
      } else {
        console.error("Enrollment failed:", data.message);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-8 max-w-md mx-auto">
          <span className="text-5xl mb-4">⚠️</span>
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/courses"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-8">
          <span className="text-5xl mb-4">🔍</span>
          <h2 className="text-2xl font-bold text-gray-700">Course not found</h2>
          <p className="text-gray-500 mt-2">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse available courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div
              ref={iconRef}
              className="bg-white bg-opacity-20 p-4 rounded-full mb-4 md:mb-0 text-4xl cursor-pointer hover:bg-opacity-30 transition-all"
              onClick={animateIcon}
            >
              {getCourseIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {course.title}
              </h1>
              <p className="text-blue-100 mb-4">{course.short_description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center px-3 py-1 bg-blue-700 bg-opacity-30 rounded-full text-sm">
                  ⏱️ {course.duration}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-blue-700 bg-opacity-30 rounded-full text-sm">
                  💰 {course.fee}
                </span>
                {course.certification && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-700 bg-opacity-30 rounded-full text-sm">
                    🏆 {course.certification}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Course Details */}
          <div className="lg:w-2/3 space-y-6">
            {/* Course Overview Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 text-xl">📚</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Course Overview
                </h2>
              </div>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">{course.description}</p>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">
                  Entry Requirements
                </h3>
                <p>{course.entry_requirement}</p>
              </div>
            </div>

            {/* What You'll Learn Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-600 text-xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  What You'll Learn
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {Array.isArray(course.content) ? (
                  course.content.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    Course content details coming soon
                  </p>
                )}
              </div>
            </div>

            {/* Course Modules Section */}
            {course.modules && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-purple-600 text-xl">📦</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Course Modules
                  </h2>
                </div>
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <h3 className="font-semibold text-lg text-gray-800">
                        {module.title}
                      </h3>
                      <p className="text-gray-600">{module.description}</p>
                      {module.duration && (
                        <p className="text-sm text-gray-500 mt-1">
                          Duration: {module.duration}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {course.faq && course.faq.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <span className="text-yellow-600 text-xl">❓</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {course.faq.map((item, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <h3 className="font-semibold text-lg text-gray-700">
                        {item.question}
                      </h3>
                      <p className="text-gray-600 mt-2">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className={`lg:w-1/3 ${isSticky ? "lg:sticky lg:top-4" : ""}`}>
            {/* Enrollment Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transform transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 text-xl">✏️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Enroll Now</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600">Course Fee</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {course.fee}
                  </p>
                  {course.discount && (
                    <p className="text-sm text-green-600 mt-1">
                      Special offer: {course.discount}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleEnrollClick}
                  disabled={isEnrolled}
                  className={`w-full py-3 bg-gradient-to-r ${
                    isEnrolled
                      ? "from-green-600 to-green-500 cursor-not-allowed"
                      : "from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  } text-white rounded-lg transition-all flex items-center justify-center font-medium gap-2`}
                >
                  {isEnrolled ? "Already Enrolled ✓" : "Enroll Now →"}
                </button>

                <div className="text-sm space-y-3 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span>🪪</span>
                      <span>SIA License Fee:</span>
                    </span>
                    <span className="font-medium">
                      {course.sia_licence_fee || "Not applicable"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span>💸</span>
                      <span>Additional Charges:</span>
                    </span>
                    <span className="font-medium">
                      {course.additional_charges || "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Requirements
                </h2>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">
                    Minimum age: {course.minimum_age || "18"} years
                  </span>
                </li>
                {course.entry_requirement && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">
                      {course.entry_requirement}
                    </span>
                  </li>
                )}
                {course.materials && (
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">
                      Required materials: {course.materials}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* Course Benefits */}
            {course.benefits && (
              <div className="bg-white rounded-xl shadow-md p-6 mt-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-purple-600 text-xl">🌟</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Key Benefits
                  </h2>
                </div>

                <ul className="space-y-3">
                  {course.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enroll Modal */}
      {/* Enroll Modal */}
      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center mx-auto px-2 sm:px-4 z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white grid mx-auto rounded-xl w-full lg:max-w-md max-w-sm  lg:mx-4 lg:p-6 p-2 shadow-2xl overflow-y-auto max-h-[90vh] animate-slideUp"
            style={{
              animation: "slideUp 0.3s ease-out forwards",
            }}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-blue-500">✍️</span>
                Enroll in {course.title}
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700 transition-colors text-xl p-1 -mr-1"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className=" text-sm sm:text-base font-medium mb-1 text-gray-700 flex items-center gap-1">
                  <span className="text-gray-500">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
                  required
                />
              </div>

              <div>
                <label className=" text-sm sm:text-base font-medium mb-1 text-gray-700 flex items-center gap-1">
                  <span className="text-gray-500">✉️</span>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className=" text-sm sm:text-base font-medium mb-1 text-gray-700 flex items-center gap-1">
                  <span className="text-gray-500">📞</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
                  required
                />
              </div>

              <div>
                <label className=" text-sm sm:text-base font-medium mb-1 text-gray-700 flex items-center gap-1">
                  <span className="text-gray-500">📍</span>
                  Preferred Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.5rem]"
                  required
                >
                  <option value="">Select a location</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className=" text-sm sm:text-base font-medium mb-1 text-gray-700 flex items-center gap-1">
                  <span className="text-gray-500">📅</span>
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Complete Enrollment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center px-2 sm:px-4 z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white rounded-xl w-full max-w-md sm:max-w-lg mx-2 sm:mx-4 p-4 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh] animate-slideUp"
            style={{
              animation: "slideUp 0.3s ease-out forwards",
            }}
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <span className="text-yellow-600 text-lg sm:text-xl">🔒</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Login Required
                </h3>
              </div>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700 transition-colors text-xl p-1 -mr-1"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-gray-600 text-sm sm:text-base">
                You need to login to enroll in this course. Please login or
                create an account to continue.
              </p>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-700 font-medium text-sm sm:text-base">
                  {course.title}
                </p>
                <p className="text-xs sm:text-sm text-blue-600">{course.fee}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Login to Enroll
              </button>
              <div className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-xs sm:text-sm text-gray-500 px-1">
                  OR
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <Link
                to="/registration"
                className="w-full py-2 sm:py-3 text-center bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.98]"
                onClick={closeModals}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Create New Account
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CourseDetail;
