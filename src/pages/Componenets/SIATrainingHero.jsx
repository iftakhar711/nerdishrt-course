import React, { useEffect, useRef } from "react";

const SIATrainingHero = () => {
  const cardsRef = useRef([]);
  const particlesRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Card animation
    const animateCards = () => {
      cardsRef.current.forEach((card, index) => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (cardPosition < screenPosition) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
          card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        }
      });
    };

    cardsRef.current.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
    });

    window.addEventListener("scroll", animateCards);
    animateCards();

    // Particle animation
    const createParticles = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const particleCount = 30;

      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full bg-white bg-opacity-10";

        // Random properties
        const size = Math.random() * 8 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;

        container.appendChild(particle);
        particlesRef.current.push(particle);
      }
    };

    createParticles();

    return () => {
      window.removeEventListener("scroll", animateCards);
      particlesRef.current.forEach((particle) => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  const features = [
    {
      title: "Various training venues",
      text: "We provide training at several locations in Greater London",
      icon: (
        <div className="text-blue-600 bg-blue-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      ),
      cardClass: "bg-blue-50 border-blue-200",
    },
    {
      title: "99% Pass rate",
      text: "Our knowledgeable, passionate, and friendly tutors will support you to achieve your qualification",
      icon: (
        <div className="text-green-600 bg-green-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ),
      cardClass: "bg-green-50 border-green-200",
    },
    {
      title: "Free exam retake",
      text: "For peace of mind we offer free retake on exams",
      icon: (
        <div className="text-purple-600 bg-purple-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      ),
      cardClass: "bg-purple-50 border-purple-200",
    },
    {
      title: "Free course book",
      text: "You will get an instant access to e-course book",
      icon: (
        <div className="text-amber-600 bg-amber-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
      ),
      cardClass: "bg-amber-50 border-amber-200",
    },
    {
      title: "Free Course Reschedule",
      text: "You can reschedule your course 24 hours before the course start date",
      icon: (
        <div className="text-cyan-600 bg-cyan-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      ),
      cardClass: "bg-cyan-50 border-cyan-200",
    },
    {
      title: "Job Support",
      text: "Our training leads to employment because we assist our learners by providing experience and connecting with our associate Security companies",
      icon: (
        <div className="text-indigo-600 bg-indigo-100 p-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      ),
      cardClass: "bg-indigo-50 border-indigo-200",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="bg-[#525e75] text-white min-h-screen p-6 relative overflow-hidden"
    >
      {/* Floating particles will be injected here via JS */}

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Original Heading - Unchanged */}
        <div className="relative overflow-hidden bg-[#6a4c93] rounded-lg mb-8">
          <div
            className="whitespace-nowrap inline-block will-change-transform py-4 animate-marquee"
            style={{ animationDuration: "5s" }} // Reduced from 20s to 10s for double speed
          >
            <h1 className="inline-block text-3xl md:text-4xl font-extrabold px-4">
              <span className="text-white">One Stop Solution For </span>
              <span className="text-yellow-300">
                SIA Security Training Courses
              </span>
            </h1>
          </div>
        </div>

        {/* Original Paragraph - Unchanged */}
        <div className="text-lg md:text-xl mb-8 leading-relaxed mx-auto text-center container font-serif">
          <p>
            nerdishrt Security is a leading provider of SIA Door Supervisor,
            Security Guard, and CCTV Operator training in the UK. As an approved
            SIA (Security Industry Authority) training provider since 2012,
            we’ve proudly trained over ten thousand successful candidates who
            have gone on to earn their official qualifications. At nerdishrt
            Security, we go beyond training — we help launch your security
            career by offering hands-on experience and connecting you with our
            trusted network of associate security companies for job
            opportunities.
          </p>
        </div>

        {/* Redesigned Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`${feature.cardClass} p-6 rounded-xl border-2 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative z-10`}
              style={{
                opacity: 0,
                transform: "translateY(30px)",
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="ml-4 text-lg font-bold text-[#6a4c93] uppercase">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm flex-grow font-serif">
                  {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) translateX(20px);
          }
          100% {
            transform: translateY(-200px) translateX(0);
            opacity: 0;
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SIATrainingHero;
