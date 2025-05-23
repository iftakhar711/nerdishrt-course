import { useEffect, useRef, useState, useCallback } from "react";
import img1 from "../../assets/door-supervisor.jpg";
import img2 from "../../assets/CCTV-Operator-Training.jpg";
import img3 from "../../assets/Emergency-First-Aid.jpg";
import img4 from "../../assets/Fire-Marshal-Training.jpg";
import img5 from "../../assets/Refresher-Door-Supervisor.jpg";
import img6 from "../../assets/Traffic-Marshal.jpg";
import img7 from "../../assets/Personal-Licence.jpg";

const SecuritySlider = () => {
  const courses = [
    {
      title: "Door Supervisor Course",
      code: "SIA Approved",
      duration: "4-Day Training",
      badge: "🛡️",
      color: "from-blue-900/90 to-blue-800/70",
      image: img1,
    },
    {
      title: "CCTV Operator Training",
      code: "PTLLS Certified",
      duration: "3-Day Program",
      badge: "📹",
      color: "from-gray-900/90 to-gray-800/70",
      image: img2,
    },
    {
      title: "Emergency First Aid",
      code: "OFQUAL Regulated",
      duration: "1-Day Certification",
      badge: "🚑",
      color: "from-red-900/90 to-red-800/70",
      image: img3,
    },
    {
      title: "Fire Marshal Training",
      code: "BS 9997 Compliant",
      duration: "6-Hour Course",
      badge: "🔥",
      color: "from-orange-900/90 to-orange-800/70",
      image: img4,
    },
    {
      title: "Refresher Door Supervisor",
      code: "SIA Renewal",
      duration: "1-Day Update",
      badge: "🔄",
      color: "from-green-900/90 to-green-800/70",
      image: img5,
    },
    {
      title: "Traffic Marshal",
      code: "CSCS Compliant",
      duration: "1-Day Safety Course",
      badge: "🚧",
      color: "from-yellow-900/90 to-yellow-800/70",
      image: img6,
    },
    {
      title: "Personal Licence",
      code: "Accredited by HABC",
      duration: "1-Day Training",
      badge: "📜",
      color: "from-purple-900/90 to-purple-800/70",
      image: img7,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === courses.length - 1 ? 0 : prev + 1));
  }, [courses.length]);

  useEffect(() => {
    timeoutRef.current = setInterval(goToNext, 6000);
    return () => clearInterval(timeoutRef.current);
  }, [goToNext]);

  return (
    <div className="relative w-full h-[350px] md:h-[400px] -z-10 lg:h-[600px] bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="absolute inset-0 pattern-circuit-board opacity-20" />

      {/* Slides */}
      <div className="relative h-full overflow-hidden">
        {courses.map((course, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ${
              index === currentSlide ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${course.color}`}
            />
            <img
              src={course.image}
              alt={course.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />

            <div className="container mx-auto h-full flex items-center px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
                {/* Text Content */}
                <div className="space-y-8 relative z-10">
                  <div className="animate-float">
                    <div className="lg:text-6xl md:text-5xl text-4xl mb-3  lg:mb-6">
                      {course.badge}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 lgmb-4">
                      {course.title}
                    </h2>
                    <div className="space-y-4">
                      <p className=" text-md lg:text-xl text-white/90 font-mono px-4 py-2 bg-black/30 rounded-lg">
                        {course.code}
                      </p>
                      <p className="text-sm lg:text-lg text-white/80 flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2" />
                        {course.duration}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Badge */}
                <div className="hidden lg:flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border-4 border-white/20 flex items-center justify-center animate-pulse-slow">
                    <div className="text-8xl">{course.badge}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {courses.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-8 rounded-full transition-all duration-500 ${
              index === currentSlide ? "bg-white w-16" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Course List */}
      {/* <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="space-y-2 text-right">
          {courses.map((course, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`block text-white/80 hover:text-white transition-all ${
                index === currentSlide ? "text-white font-bold scale-110" : ""
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>
      </div> */}

      {/* Animated Elements */}
      <style jsx global>{`
        .pattern-circuit-board {
          background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SecuritySlider;
