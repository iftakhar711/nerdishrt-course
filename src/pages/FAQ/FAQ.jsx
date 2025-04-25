import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [activeCourse, setActiveCourse] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const headingRef = useRef(null);
  const courseButtonsRef = useRef([]);
  const faqContainerRef = useRef(null);

  const courses = {
    "🚑 Emergency First Aid": [
      {
        q: "What certification will I receive?",
        a: "OFQUAL-regulated Level 3 Emergency First Aid at Work (EFAW) certification",
      },
      {
        q: "Course duration?",
        a: "1-day intensive training (7 contact hours)",
      },
      {
        q: "Validity period?",
        a: "3 years before requiring refresher training",
      },
    ],
    "🔥 Fire Marshal Training": [
      {
        q: "Training compliance?",
        a: "Meets Regulatory Reform (Fire Safety) Order 2005 requirements",
      },
      {
        q: "Practical exercises?",
        a: "Live fire extinguisher training with CO2 and water units",
      },
      {
        q: "Assessment method?",
        a: "Written test + practical scenario evaluation",
      },
    ],
    "🛡️ Door Supervisor": [
      {
        q: "SIA exam included?",
        a: "Yes, final day exam with physical intervention assessment",
      },
      { q: "Minimum age requirement?", a: "18 years with valid ID proof" },
      {
        q: "License application help?",
        a: "Full SIA application guidance included",
      },
    ],
    "📹 CCTV Operator": [
      {
        q: "Course accreditation?",
        a: "National CCTV Certification Scheme (NCCS)",
      },
      {
        q: "Software training?",
        a: "Includes training on Digital Watchdog & Hikvision systems",
      },
      {
        q: "Job placement help?",
        a: "Free access to our security industry job board",
      },
    ],
  };

  // Reset refs array on each render
  useEffect(() => {
    courseButtonsRef.current = [];
  }, []);

  // Initial animations
  useEffect(() => {
    gsap.from(headingRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
    });

    gsap.from(courseButtonsRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
    });
  }, []);

  // Animate FAQ content when shown
  useEffect(() => {
    if (activeCourse && faqContainerRef.current) {
      gsap.fromTo(
        faqContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
    }
  }, [activeCourse]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-20 px-6 bg-gradient-to-b from-[#141e61] to-[#3c5eff] text-white">
      <div className="max-w-6xl mx-auto">
        <h1
          ref={headingRef}
          className="text-3xl md:text-5xl font-bold text-center mb-14 tracking-tight"
        >
          Frequently Asked Questions
        </h1>

        {/* Course Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.keys(courses).map((course, index) => (
            <button
              key={course}
              ref={(el) => {
                if (el) courseButtonsRef.current[index] = el;
              }}
              onClick={() => {
                setOpenIndex(null);
                setActiveCourse(activeCourse === course ? null : course);
              }}
              className={`bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-all border border-white/10 ${
                activeCourse === course ? "ring-2 ring-white" : ""
              }`}
            >
              <span className="text-lg font-semibold">{course}</span>
            </button>
          ))}
        </div>

        {/* FAQ Display */}
        {activeCourse && (
          <div
            ref={faqContainerRef}
            className="bg-white/10 p-8 rounded-2xl backdrop-blur-md"
          >
            <h2 className="text-2xl font-bold mb-6">{activeCourse} FAQs</h2>
            <div className="space-y-4">
              {courses[activeCourse].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-5 rounded-lg cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{faq.q}</h3>
                    <FaChevronDown
                      className={`transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all text-slate-300 ${
                      openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                    }`}
                  >
                    <p className="transition-opacity duration-300">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
