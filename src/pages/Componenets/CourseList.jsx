import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CourseList = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const underlineRef = useRef(null);
  const courseRefs = useRef([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [courses, setCourses] = React.useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server-production.up.railway.app/courses/featured"
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
  console.log(error);
  const top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const underline = underlineRef.current;

    // Set initial state
    [heading, subheading, underline].forEach((el) => {
      if (el) {
        el.style.opacity = 0;
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.5s ease-out";
      }
    });

    // Animate heading in sequence
    setTimeout(() => {
      heading.style.opacity = 1;
      heading.style.transform = "translateY(0)";
    }, 100);

    setTimeout(() => {
      subheading.style.opacity = 1;
      subheading.style.transform = "translateY(0)";
    }, 300);

    setTimeout(() => {
      underline.style.opacity = 1;
      underline.style.transform = "scaleX(1)";
      underline.style.transition = "transform 0.4s ease-out";
    }, 500);

    // Set initial course styles
    courseRefs.current.forEach((card) => {
      if (card) {
        card.style.opacity = 0;
        card.style.transform = "translateY(30px)";
        card.style.transition = "all 0.5s ease-out";
      }
    });

    // Animate cards on scroll using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              const el = entry.target;
              el.style.opacity = 1;
              el.style.transform = "translateY(0)";
            }, index * 80);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    courseRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="container mx-auto py-8 px-4  bg-white">
      {/* Heading Section */}
      <div className="text-center mb-4">
        <h1
          ref={headingRef}
          className="text-3xl md:text-[44px] font-extrabold mb-2"
        >
          <span className="bg-clip-text text-transparent bg-[#6a4c93]">
            Professional Security
          </span>
        </h1>
        <h2
          ref={subheadingRef}
          className="text-xl md:text-2xl font-semibold text-black"
        >
          Training & Certification
        </h2>
        <div
          ref={underlineRef}
          className="w-32 h-1 mt-2 mx-auto bg-[#92ba92] rounded-full"
          style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
        />
      </div>

      {/* Courses Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading ? (
          courses.map((course, index) => (
            <Link
              to={`/courses/${course.slug}`}
              onClick={top}
              key={course.id}
              ref={(el) => (courseRefs.current[index] = el)}
              className="group relative p-4 rounded-xl border border-gray-200 hover:shadow-lg 
        transition-all duration-200 overflow-hidden bg-[#525e75]
        hover:brightness-110 text-white"
            >
              <div className="flex items-start space-x-4">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl bg-white bg-opacity-20 backdrop-blur-sm 
            flex items-center justify-center text-3xl border-2 border-white border-opacity-30 
            group-hover:scale-110 transition-transform"
                >
                  {course.icon}
                </div>
                <h3 className="text-xl font-bold mt-1">{course.title}</h3>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-white text-lg mt-6">
            Loading courses...
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
