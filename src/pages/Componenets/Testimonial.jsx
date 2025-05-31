import React, { useRef, useEffect, useState } from "react";
import { StarIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { gsap } from "gsap";

const TestimonialSlider = () => {
  const sliderTrackRef = useRef(null);
  const animationRef = useRef(null);
  const sliderRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    review: "",
    stars: 5,
    city: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 1. Fetch original testimonials from the backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server-production.up.railway.app/testimonials"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }
        const data = await response.json();
        if (data.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // 2. Initialize and control the slider animation
  useEffect(() => {
    // Only run animation if there are testimonials to display
    if (loading || error || testimonials.length === 0) return;

    const sliderTrack = sliderTrackRef.current;
    const sliderElement = sliderRef.current;
    if (!sliderTrack || !sliderElement) return;

    const slides = Array.from(
      sliderTrack.querySelectorAll(".testimonial-slide")
    );
    if (slides.length === 0) return;

    // Card entrance animation
    gsap.from(".testimonial-card", {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.6,
      ease: "back.out(1)",
    });

    const startAutoScroll = () => {
      const slideWidth = slides[0].offsetWidth + 32; // 32 is for space-x-8
      const totalWidth = slideWidth * slides.length;
      let scrollPosition = 0;
      const speed = 0.5; // Adjusted speed for a smoother scroll
      let lastTimestamp = 0;

      const animate = (timestamp) => {
        if (lastTimestamp) {
          const delta = timestamp - lastTimestamp;
          scrollPosition -= speed * (delta / 16);

          // If scrolled past all items, reset to start
          if (scrollPosition <= -totalWidth + slideWidth * 3) {
            scrollPosition = 0;
            gsap.set(sliderTrack, { x: 0 });
          } else {
            gsap.set(sliderTrack, { x: scrollPosition });
          }
        }
        lastTimestamp = timestamp;
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const scrollTimer = setTimeout(startAutoScroll, 3000);

    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
        gsap.to(sliderTrack, {
          x: gsap.getProperty(sliderTrack, "x"),
          duration: 0.5,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      if (!animationRef.current) {
        startAutoScroll();
      }
    };

    sliderElement.addEventListener("mouseenter", handleMouseEnter);
    sliderElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(scrollTimer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Kill any running GSAP animations on the track to prevent memory leaks
      gsap.killTweensOf(sliderTrack);
      if (sliderElement) {
        sliderElement.removeEventListener("mouseenter", handleMouseEnter);
        sliderElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [loading, error, testimonials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      stars: rating,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://nerdishrt-course-server-production.up.railway.app/testimonials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTestimonials((prev) => [result.testimonial, ...prev]);
        setShowSuccessMessage(true);
        setShowReviewModal(false);
        setNewReview({
          name: "",
          review: "",
          stars: 5,
          city: "",
        });

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setShowSuccessMessage(false);
    }
  };

  if (loading)
    return <div className="text-center py-12">Loading testimonials...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50 py-8 overflow-hidden relative">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
          Thank you for your review!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Static Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-[44px] font-extrabold mb-2">
            <span className="bg-clip-text text-transparent bg-[#6a4c93]">
              What Our Clients Say
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-black">
            Reviews from Our Customers
          </h2>
          <div className="w-32 h-1 mx-auto bg-[#92ba92] rounded-full mt-2" />
        </div>

        {/* Testimonial Slider */}
        {testimonials.length > 0 ? (
          <div ref={sliderRef} className="relative overflow-hidden pb-6">
            <div ref={sliderTrackRef} className="flex space-x-8 pb-8 w-max">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className="testimonial-slide flex-shrink-0 w-80 md:w-96 testimonial-card"
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
                          <span>
                            {new Date(testimonial.date).toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "long", day: "numeric" }
                            )}
                          </span>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No testimonials available yet</p>
          </div>
        )}

        {/* Add Review Button */}
        <div className="text-center mt-2">
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-[#6a4c93] hover:to-[#82aa82] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Share Your Experience
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Share Your Review
            </h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a4c93]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Your City</label>
                <input
                  type="text"
                  name="city"
                  value={newReview.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a4c93]"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`h-8 w-8 ${
                          star <= newReview.stars
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Your Review</label>
                <textarea
                  name="review"
                  value={newReview.review}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a4c93]"
                  rows="4"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#6a4c93]  text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialSlider;
