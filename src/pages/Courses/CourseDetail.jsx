import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
// Outline version
import {
  CurrencyEuroIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const CourseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUserData } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const heroRef = useRef(null);
  const modalRef = useRef(null);
  const successModalRef = useRef(null);
  const enrollButtonRef = useRef(null);
  const confettiRef = useRef(null);

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

  // Animation helpers
  const animateElement = (
    element,
    properties,
    duration = 0.3,
    easing = "cubic-bezier(0.4, 0, 0.2, 1)"
  ) => {
    if (!element) return;

    element.style.transition = `all ${duration}s ${easing}`;
    Object.keys(properties).forEach((prop) => {
      element.style[prop] = properties[prop];
    });

    return () => {
      element.style.transition = "";
      Object.keys(properties).forEach((prop) => {
        element.style[prop] = "";
      });
    };
  };

  // Confetti animation
  const triggerConfetti = () => {
    if (!confettiRef.current) return;

    const colors = ["#FF5252", "#FFD740", "#64FFDA", "#448AFF", "#B388FF"];
    const container = confettiRef.current;
    container.innerHTML = "";

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = "-10px";
      confetti.style.borderRadius = "50%";
      confetti.style.opacity = "0";
      confetti.style.transform = "translateY(0) rotate(0deg)";

      container.appendChild(confetti);

      // Animate each confetti piece
      setTimeout(() => {
        confetti.style.opacity = "1";
        confetti.style.transform = `translateY(${
          window.innerHeight
        }px) rotate(${Math.random() * 360}deg)`;
        confetti.style.transition = `all ${
          Math.random() * 3 + 2
        }s cubic-bezier(0.1, 0.8, 0.3, 1)`;
      }, i * 50);
    }
  };

  // Modal animations
  const animateModalIn = useCallback(() => {
    if (!modalRef.current) return;

    const modal = modalRef.current;
    modal.style.opacity = "0";
    modal.style.transform = "translateY(20px) scale(0.98)";
    modal.style.transition = "none";
    modal.getBoundingClientRect();

    animateElement(
      modal,
      {
        opacity: "1",
        transform: "translateY(0) scale(1)",
      },
      0.3,
      "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    );
  }, []);

  const animateModalOut = (callback) => {
    if (!modalRef.current) return callback();

    const modal = modalRef.current;
    animateElement(
      modal,
      {
        opacity: "0",
        transform: "translateY(20px) scale(0.98)",
      },
      0.2
    );

    setTimeout(() => {
      callback();
    }, 200);
  };

  // Success modal animations
  const animateSuccessModalIn = useCallback(() => {
    if (!successModalRef.current) return;

    const modal = successModalRef.current;
    modal.style.opacity = "0";
    modal.style.transform = "scale(0.8)";
    modal.style.transition = "none";
    modal.getBoundingClientRect();

    animateElement(
      modal,
      {
        opacity: "1",
        transform: "scale(1)",
      },
      0.4,
      "cubic-bezier(0.175, 0.885, 0.32, 1.4)"
    );

    triggerConfetti();
  }, []);

  const animateSuccessModalOut = (callback) => {
    if (!successModalRef.current) return callback();

    const modal = successModalRef.current;
    animateElement(
      modal,
      {
        opacity: "0",
        transform: "scale(0.9)",
      },
      0.2
    );

    setTimeout(() => {
      callback();
    }, 200);
  };

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${
          scrollPosition * 0.3
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `https://nerdishrt-course-server-production.up.railway.app/courses/${slug}`
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

  // Check if user is enrolled
  useEffect(() => {
    if (user?.courses) {
      const enrolled = user.courses.some((c) => c.slug === slug);
      setIsEnrolled(enrolled);
    }
  }, [user, slug]);

  // Handle modal open/close effects
  useEffect(() => {
    if (showEnrollModal || showLoginPrompt) {
      document.body.style.overflow = "hidden";
      animateModalIn();
    } else {
      document.body.style.overflow = "auto";
    }

    if (showSuccessModal) {
      document.body.style.overflow = "hidden";
      animateSuccessModalIn();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    showEnrollModal,
    showLoginPrompt,
    showSuccessModal,
    animateModalIn,
    animateSuccessModalIn,
  ]);

  const handleEnrollClick = () => {
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
    document.body.style.overflow = "auto"; // Reset overflow before navigating
    navigate("/login", { state: { from: `/courses/${slug}` } });
  };

  const closeModals = () => {
    animateModalOut(() => {
      setShowEnrollModal(false);
      setShowLoginPrompt(false);
      document.body.style.overflow = "auto";
    });
  };

  const closeSuccessModal = () => {
    animateSuccessModalOut(() => {
      setShowSuccessModal(false);
      document.body.style.overflow = "auto";
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
        "https://nerdishrt-course-server-production.up.railway.app/enroll",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userEmail: user.email,
            courseSlug: slug,
            phone: formData.phone,
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
        setShowSuccessModal(true);
      } else {
        console.error("Enrollment failed:", data.message);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
    }
  };

  const Top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div
              className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
              style={{ animationDuration: "1.5s" }}
            ></div>
            <div
              className="absolute inset-2 rounded-full border-4 border-blue-300 border-b-transparent animate-spin-reverse"
              style={{ animationDuration: "2s" }}
            ></div>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800">
            Loading Course
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Preparing an exceptional learning experience for you...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-4 p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01]">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full text-red-500 text-4xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Course
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/courses"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-4 p-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-[1.01]">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full text-blue-500 text-4xl">
            🔍
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/courses"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-center"
            >
              Browse Courses
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all shadow-sm hover:shadow text-center"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-14">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative overflow-hidden bg-gray-900 text-white h-96 md:h-[32rem]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
          marginBottom: "-4rem",
        }}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${course.imageUrl})`,
          }}
        ></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center">
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 bg-white text-black bg-opacity-20 rounded-full mb-6 text-sm font-medium backdrop-blur-sm border border-white border-opacity-30">
              {course.category || "Professional Training"}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {course.title}
            </h1>
            <p className=" text-sm md:text-md lg:text-lg  text-gray-300 mb-8 max-w-3xl">
              {course.short_description ||
                "Master the skills you need to advance your career with our comprehensive training program."}
            </p>

            <div className="flex flex-wrap gap-4">
              <div className=" flex font-semibold  items-center justify-center gap-1 text-white  bg-opacity-10 backdrop-blur-sm px-4 py-2 ">
                <CalendarIcon className="w-4 h-4"></CalendarIcon>
                <span>{course.duration}</span>
              </div>
              <div className=" flex font-semibold  items-center justify-center gap-1 text-white  bg-opacity-10 backdrop-blur-sm px-4 py-2 ">
                <CurrencyEuroIcon className="w-4 h-4"></CurrencyEuroIcon>
                <span>{course.fee}</span>
              </div>
              <div className=" flex font-semibold  items-center justify-center gap-1 text-white  bg-opacity-10 backdrop-blur-sm px-4 py-2 ">
                <ClockIcon className="w-4 h-4"></ClockIcon>
                <span>{course.session}</span>
              </div>
              <div className=" flex font-semibold  items-center justify-center gap-1 text-white  bg-opacity-10 backdrop-blur-sm px-4 py-2 ">
                <AcademicCapIcon className="w-4 h-4"></AcademicCapIcon>
                <span>{course.teachingMethod}</span>
              </div>
              {course.certification && (
                <div className=" flex font-semibold  items-center justify-center gap-1 text-white  bg-opacity-10 backdrop-blur-sm px-4 py-2 ">
                  <CalendarIcon className="w-4 h-4"></CalendarIcon>
                  <span>{course.certification}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Course Details */}
          <div className="lg:w-2/3 space-y-8">
            {/* Course Tabs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
                      activeTab === "overview"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Overview
                  </button>
                  {course.content && (
                    <button
                      onClick={() => setActiveTab("curriculum")}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
                        activeTab === "curriculum"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Curriculum
                    </button>
                  )}
                  {course.faq && course.faq.length > 0 && (
                    <button
                      onClick={() => setActiveTab("faq")}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-1 ${
                        activeTab === "faq"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      FAQ
                    </button>
                  )}
                </nav>
              </div>

              <div className="p-6 sm:p-8">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="prose max-w-none text-black ">
                      <div className="space-y-4 text-md font-serif leading-relaxed">
                        {course.overview
                          .split(/\n\n|\.\s+/) // You can adjust the regex depending on your separator
                          .map((paragraph, index) => (
                            <p key={index}>
                              {paragraph.trim() +
                                (index !==
                                course.overview.split(/\n\n|\.\s+/).length - 1
                                  ? "."
                                  : "")}
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-6">
                    {Array.isArray(course.content) ? (
                      <div className="space-y-4">
                        {course.content.map((item, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg font-medium">
                                {index + 1}
                              </div>
                              <h3 className="font-medium text-gray-800">
                                {item}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Detailed curriculum coming soon
                      </div>
                    )}
                  </div>
                )}

                {/* FAQ Tab */}
                {activeTab === "faq" && (
                  <div className="space-y-6">
                    {course.faq.map((item, index) => (
                      <div key={index} className="group">
                        <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                            {item.question}
                          </h3>
                          <p className="text-gray-600 mt-2">{item.answer}</p>
                        </div>
                        {index < course.faq.length - 1 && (
                          <div className="h-px bg-gray-100 w-full"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Course Modules */}
            {course.modules && course.modules.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl text-purple-600 text-2xl">
                      📦
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      Detailed Modules
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {course.modules.map((module, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-5 py-2 group hover:bg-gray-50 transition-colors rounded-lg"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {module.description}
                        </p>
                        {module.duration && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>⏱️</span>
                            <span>Duration: {module.duration}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6 lg:sticky lg:top-6 lg:h-fit lg:pb-8">
            {/* Enrollment Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl text-blue-600 text-2xl">
                    ✏️
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Enroll Now
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#525e75] p-5 rounded-xl text-white">
                    <p className="text-sm opacity-90">Total Course Fee</p>
                    <p className="text-3xl font-bold mb-1">£{course.fee}</p>
                    {course.discount && (
                      <p className="text-sm bg-white bg-opacity-20 inline-block px-3 py-1 rounded-md">
                        {course.discount}
                      </p>
                    )}
                  </div>

                  <button
                    ref={enrollButtonRef}
                    onClick={handleEnrollClick}
                    disabled={isEnrolled}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                      isEnrolled
                        ? "bg-gradient-to-r from-green-600 to-green-500  text-white shadow-lg cursor-not-allowed"
                        : "bg-[#6a4c93]  hover:bg-sky-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                    }`}
                  >
                    {isEnrolled ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Enrolled Successfully
                      </span>
                    ) : (
                      <span className="flex items-center justify-center  gap-2">
                        📝 Enroll Now
                      </span>
                    )}
                  </button>

                  <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-400">💳</span>
                        <span>SIA License Fee:</span>
                      </span>
                      <span className="font-medium">
                        £{course.siaLicenceFee || "Not applicable"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-400">💸</span>
                        <span>Additional Charges:</span>
                      </span>
                      <span className="font-medium">
                        £{course.additionalCharges || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-gray-400">📅</span>
                        <span>Next Start Date:</span>
                      </span>
                      <span className="font-medium">
                        {course.next_start_date || "Flexible"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-xl text-green-600 text-2xl">
                    ✅
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Requirements
                  </h2>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-gray-700">
                      Minimum age: {course.minimum_age || "18"} years
                    </span>
                  </li>
                  {course.entryRequirement && (
                    <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-gray-700">
                        {course.entryRequirement}
                      </span>
                    </li>
                  )}
                  {course.materials && (
                    <li className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-gray-700">
                        Required materials: {course.materials}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Benefits Card */}
            {course.benefits && course.benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-xl text-purple-600 text-2xl">
                      🌟
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Key Benefits
                    </h2>
                  </div>

                  <ul className="space-y-3">
                    {course.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full mt-0.5 flex-shrink-0">
                          •
                        </span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all"
            style={{
              opacity: 0,
              transform: "translateY(20px) scale(0.98)",
            }}
          >
            <div className="relative">
              {/* Modal header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    Enroll in {course.title}
                  </h3>
                  <button
                    onClick={closeModals}
                    className="text-white hover:text-gray-200 transition-colors text-2xl p-1 -mr-1"
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-blue-100 mt-1 text-sm">
                  Complete your enrollment details
                </p>
              </div>

              {/* Modal body */}
              <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      placeholder="John Doe"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
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
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 transition-all"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
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
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      placeholder="+44 123 456 7890"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
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
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Location
                  </label>
                  <div className="relative">
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                      required
                    >
                      <option value="">Select a location</option>
                      {locations.map((loc, index) => (
                        <option key={index} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
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
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
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
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Complete Enrollment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all"
            style={{
              opacity: 0,
              transform: "translateY(20px) scale(0.98)",
            }}
          >
            <div className="relative">
              {/* Modal header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                    Login Required
                  </h3>
                  <button
                    onClick={closeModals}
                    className="text-white hover:text-gray-200 transition-colors text-2xl p-1 -mr-1"
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-blue-100 mt-1 text-sm">
                  Please login to enroll in this course
                </p>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-800">{course.title}</h4>
                  <p className="text-blue-600 mt-1">{course.fee}</p>
                </div>

                <p className="text-gray-600 text-center">
                  You need to login to enroll in this course. Please login or
                  create an account to continue.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
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
                    Login to Continue
                  </button>

                  <div className="flex items-center my-2">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  <Link
                    to="/registration"
                    onClick={() => {
                      closeModals();
                      Top();
                      document.body.style.overflow = "auto";
                    }}
                    className="w-full py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-medium transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    Create New Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal with Confetti */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={successModalRef}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all relative"
            style={{
              opacity: 0,
              transform: "scale(0.8)",
            }}
          >
            {/* Confetti container */}
            <div
              ref={confettiRef}
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ zIndex: -1 }}
            ></div>

            <div className="relative z-10">
              {/* Modal header with gradient */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Congratulations!
                  </h3>
                  <button
                    onClick={closeSuccessModal}
                    className="text-white hover:text-gray-200 transition-colors text-2xl p-1 -mr-1"
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-green-100 mt-1 text-sm">
                  You've successfully enrolled in the course
                </p>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-6 text-center">
                <div className="w-24 h-24 mx-auto flex items-center justify-center bg-green-100 text-green-600 rounded-full text-5xl">
                  🎉
                </div>

                <h4 className="text-2xl font-bold text-gray-800">
                  Enrollment Confirmed!
                </h4>

                <p className="text-gray-600">
                  You're now enrolled in{" "}
                  <span className="font-semibold text-gray-800">
                    {course.title}
                  </span>
                  . We've sent the details to your email.
                </p>

                <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Course:</span>
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Amount Paid:</span>
                    <span className="font-medium">£{course.fee}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Location:</span>
                    <span className="font-medium">{formData.location}</span>
                  </div>
                </div>

                <button
                  onClick={closeSuccessModal}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  Continue to Dashboard
                </button>

                <p className="text-sm text-gray-500">
                  Need help?{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Contact support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
