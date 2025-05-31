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
        a: "Upon completing this course, you will be awarded the OFQUAL-regulated Level 3 Emergency First Aid at Work (EFAW) certificate. This qualification is widely recognized throughout the UK and is suitable for individuals who want to act as first responders in workplace emergencies. It demonstrates that you are competent in handling life-threatening situations and administering first aid until professional help arrives.",
      },
      {
        q: "Course duration?",
        a: "The course is delivered over a single day with a total of 7 guided learning hours. Despite its short duration, it is packed with essential practical and theoretical knowledge, ensuring that you walk away with strong, applicable first aid skills that can make a real difference in emergencies.",
      },
      {
        q: "Validity period?",
        a: "The certification is valid for a period of 3 years from the date of issue. After this period, learners are encouraged to undertake a refresher course to stay updated with the latest first aid procedures and to retain the necessary skills required in critical situations.",
      },
      {
        q: "Is practical first aid included?",
        a: "Yes, the course includes a variety of hands-on exercises, including CPR on adult mannequins, how to use an AED (Automated External Defibrillator), applying bandages, managing choking, and placing a casualty in the recovery position. These practical activities are essential for building real-life confidence.",
      },
    ],
    "🔥 Fire Marshal Training": [
      {
        q: "Training compliance?",
        a: "Our Fire Marshal Training course fully complies with the requirements of the Regulatory Reform (Fire Safety) Order 2005. This ensures that individuals who are responsible for fire safety in their workplace or premises are legally competent and meet all the current health and safety legislation standards.",
      },
      {
        q: "Practical exercises?",
        a: "Participants engage in live fire extinguisher practice using CO2 and water extinguishers under supervision. This hands-on experience allows learners to build confidence in using extinguishers effectively and safely while understanding the differences between fire classes and corresponding extinguishing methods.",
      },
      {
        q: "Assessment method?",
        a: "Assessment is carried out through a combination of a multiple-choice theory exam and participation in practical scenarios. These methods ensure the learner not only understands fire safety procedures but is also capable of implementing them confidently in a real-life emergency.",
      },
      {
        q: "Who should take this course?",
        a: "This course is ideal for anyone designated as a fire warden, marshal, or responsible person in the workplace. It is particularly beneficial for business owners, supervisors, facilities managers, and those in charge of health and safety who need to ensure fire evacuation plans are understood and executed effectively.",
      },
    ],
    "🛡️ Door Supervisor": [
      {
        q: "SIA exam included?",
        a: "Yes, the course includes the official SIA-endorsed examinations. The final day of the course consists of a physical intervention assessment and multiple-choice exams. You must pass these assessments to receive your training qualification, which is required to apply for the SIA Door Supervisor License.",
      },
      {
        q: "Minimum age requirement?",
        a: "To enroll in the Door Supervisor course, candidates must be at least 18 years old and present valid proof of identification such as a passport, driver’s license, or biometric residence permit. This is to ensure eligibility for the SIA license application process, which is required to legally work in the private security sector.",
      },
      {
        q: "License application help?",
        a: "We guide all students through the full SIA licensing process after completing the course. From gathering the necessary documents to submitting your application online and preparing for identity and criminal record checks, our team is here to ensure you don’t face any hurdles in getting licensed.",
      },
      {
        q: "What topics are covered?",
        a: "The course covers a broad range of essential subjects including conflict management, physical intervention skills, the roles and responsibilities of door supervisors, the law surrounding the use of force, search procedures, drug awareness, dealing with emergencies, and effective communication. The goal is to fully prepare learners for safe and professional conduct while on duty.",
      },
    ],
    "📹 CCTV Operator": [
      {
        q: "Course accreditation?",
        a: "The CCTV Operator course is accredited under the National CCTV Certification Scheme (NCCS) and meets SIA licensing requirements. It ensures candidates are trained to a nationally recognized standard and are legally eligible to work in CCTV monitoring roles across a range of industries including public space surveillance, retail, and corporate security.",
      },
      {
        q: "Software training?",
        a: "Trainees receive practical instruction on leading CCTV systems including Digital Watchdog and Hikvision. This hands-on software training equips learners with the knowledge to operate surveillance systems, conduct playback reviews, manage footage storage, and maintain security logs—vital skills for any professional CCTV operator.",
      },
      {
        q: "Job placement help?",
        a: "We offer access to our internal security job board featuring vacancies from our network of trusted employers. Additionally, our career support team helps with CV writing, interview preparation, and matching your profile with job openings to increase your chances of quick employment after course completion.",
      },
      {
        q: "What job roles can I apply for?",
        a: "Upon certification, you are qualified to apply for a wide range of surveillance roles, including control room operator, mobile surveillance, shopping centre CCTV monitoring, transport and infrastructure surveillance, and private business security monitoring. These roles are in demand and offer a great entry point into the security industry.",
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
    <div className="min-h-screen py-20 px-6 bg-[#525e75] text-white">
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
                    className={`overflow-hidden transition-all text-[#f1ddbf] font-medium lg:font-bold ${
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
