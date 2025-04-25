import React, { useRef, useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { gsap } from "gsap";

const TestimonialSlider = () => {
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const underlineRef = useRef(null);
  const sliderTrackRef = useRef(null);
  const animationRef = useRef(null);
  const sliderRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const testimonials = [
    {
      name: "John Smith",
      review:
        "The SIA training was exceptional! The instructors were knowledgeable and made complex topics easy to understand. I passed my exam on the first try.",
      stars: 5,
      date: "15 May 2023",
      city: "London",
    },
    {
      name: "Sarah Johnson",
      review:
        "Fantastic course with excellent support. The practical sessions were particularly helpful. Highly recommend to anyone pursuing security qualifications.",
      stars: 4,
      date: "22 June 2023",
      city: "Manchester",
    },
    {
      name: "David Wilson",
      review:
        "Professional training center with top-notch facilities. The career support after completing the course helped me land a job within two weeks!",
      stars: 5,
      date: "03 July 2023",
      city: "Birmingham",
    },
    {
      name: "Emma Thompson",
      review:
        "The course content was comprehensive and well-structured. The instructors were patient and always willing to help. Best training investment I've made.",
      stars: 5,
      date: "18 August 2023",
      city: "Leeds",
    },
    {
      name: "Michael Brown",
      review:
        "Excellent balance of theory and practical exercises. The mock exams were extremely helpful in preparing for the real test. 10/10 would recommend.",
      stars: 5,
      date: "05 September 2023",
      city: "Liverpool",
    },
    {
      name: "Sophia Garcia",
      review:
        "As someone new to the security industry, this course gave me all the knowledge and confidence I needed. The job placement assistance was a huge bonus!",
      stars: 4,
      date: "12 October 2023",
      city: "Bristol",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);

    // Set initial styles to ensure visibility
    gsap.set([headingRef.current, subheadingRef.current], {
      opacity: 1,
      visibility: "visible",
    });

    // Heading animation
    const tl = gsap.timeline();
    tl.from(headingRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    })
      .from(
        subheadingRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        underlineRef.current,
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      );

    // Initialize slider after component mounts
    const initSlider = () => {
      const sliderTrack = sliderTrackRef.current;
      if (!sliderTrack) return;

      const slides = Array.from(
        sliderTrack.querySelectorAll(".testimonial-slide")
      );
      if (slides.length === 0) return;

      // Clone slides for infinite loop
      slides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.classList.add("clone");
        sliderTrack.appendChild(clone);
      });

      // Force reflow to ensure clones are rendered
      void sliderTrack.offsetWidth;

      // Card animations
      gsap.from(".testimonial-card", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.6,
        ease: "back.out(1)",
      });

      // Auto-scroll functionality
      const startAutoScroll = () => {
        const slideWidth = slides[0].offsetWidth + 32; // Include gap
        const totalWidth = slideWidth * slides.length;
        let scrollPosition = 0;
        const speed = 1; // pixels per frame

        const animate = () => {
          scrollPosition -= speed;

          // If we've scrolled past the original slides, reset to start
          if (scrollPosition <= -totalWidth) {
            scrollPosition = 0;
            gsap.set(sliderTrack, { x: 0 });
          }

          gsap.set(sliderTrack, { x: scrollPosition });
          animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
      };

      // Start auto-scroll after initial animations
      const scrollTimer = setTimeout(startAutoScroll, 3000);

      // Pause on hover
      const handleMouseEnter = () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      };

      const handleMouseLeave = () => {
        if (!animationRef.current) {
          startAutoScroll();
        }
      };

      sliderRef.current?.addEventListener("mouseenter", handleMouseEnter);
      sliderRef.current?.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        clearTimeout(scrollTimer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        sliderRef.current?.removeEventListener("mouseenter", handleMouseEnter);
        sliderRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      };
    };

    // Initialize slider after a small delay to ensure DOM is ready
    const initTimer = setTimeout(initSlider, 50);

    return () => {
      clearTimeout(initTimer);
    };
  }, [isLoaded]);

  return (
    <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Heading - Guaranteed Visible */}
        <div className="text-center mb-16">
          <h1
            ref={headingRef}
            className="text-4xl md:text-5xl font-extrabold mb-2"
            style={{ opacity: 1, visibility: "visible" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              What Our Clients Say
            </span>
          </h1>
          <h2
            ref={subheadingRef}
            className="text-2xl md:text-3xl mt-4 font-semibold text-gray-700"
            style={{ opacity: 1, visibility: "visible" }}
          >
            Reviews from Our Customers
          </h2>
          <div
            ref={underlineRef}
            className="w-32 h-1.5 mx-auto bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-8"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Redesigned Testimonial Slider with Infinite Loop */}
        <div ref={sliderRef} className="relative overflow-hidden">
          <div ref={sliderTrackRef} className="flex space-x-8 pb-8 w-max">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-slide flex-shrink-0 w-80 md:w-96 testimonial-card"
                style={{ opacity: isLoaded ? 1 : 0 }} // Ensure cards are visible after load
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {testimonial.stars}.0
                    </span>
                  </div>

                  <blockquote className="text-gray-600 mb-6 italic text-base leading-relaxed">
                    "{testimonial.review}"
                  </blockquote>

                  <div className="flex items-center mt-auto">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg mr-4">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{testimonial.date}</span>
                        <span className="mx-2">•</span>
                        <span>{testimonial.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
