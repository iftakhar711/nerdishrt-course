import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ConstructionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();
  const progressRef = useRef();
  const particlesRef = useRef([]);
  const iconRef = useRef();

  // Add to particles array
  const addToParticles = (el) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };

  // Open modal on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Animate when open state changes
  useGSAP(() => {
    if (isOpen) {
      // Modal entrance animation
      gsap.from(modalRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.8,
        rotation: -5,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });

      // Progress bar animation
      gsap.from(progressRef.current, {
        width: 0,
        duration: 2,
        ease: "power2.inOut",
      });

      // Icon wobble animation
      gsap.to(iconRef.current, {
        rotation: 5,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });

      // Particles animation
      particlesRef.current.forEach((particle, i) => {
        gsap.to(particle, {
          x: gsap.utils.random(-50, 50),
          y: gsap.utils.random(-50, 50),
          opacity: 1,
          scale: 1,
          duration: gsap.utils.random(2, 4),
          delay: i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }
  }, [isOpen]);

  const closeModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setIsOpen(false),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent  bg-opacity-50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700"
      >
        {/* Construction elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-500"></div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Main content */}
        <div className="p-8 text-center">
          <div ref={iconRef} className="inline-block mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Under Construction
          </h2>
          <p className="text-gray-300 mb-6">
            We're building something amazing! Our website will be ready soon.
            Stay tuned for updates.
          </p>

          <div className="relative h-4 bg-gray-700 rounded-full mb-6 overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-yellow-500 rounded-full w-0"
            />
          </div>

          <button
            onClick={closeModal}
            className="px-6 py-3 bg-[#6A4C93] hover:bg-yellow-300 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg hover:shadow-yellow-500/20"
          >
            Got It - I'll Check Back Later
          </button>
        </div>

        {/* Construction corner elements */}
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-yellow-500"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-yellow-500"></div>

        {/* Animated particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            ref={addToParticles}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-0"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              transform: "scale(0)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ConstructionModal;
