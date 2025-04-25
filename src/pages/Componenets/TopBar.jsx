import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const TopBar = () => {
  const topBarRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const socialRefs = useRef([]);
  const tl = useRef();

  useEffect(() => {
    // Ensure all refs are available
    if (!topBarRef.current || !phoneRef.current || !emailRef.current) return;

    // Create a copy of social refs array
    const socialElements = [...socialRefs.current].filter(Boolean);

    // Initialize timeline
    tl.current = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Set initial state (visible)
    gsap.set(topBarRef.current, { opacity: 1, y: 0 });

    // Animation sequence
    tl.current
      .fromTo(
        topBarRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
      .fromTo(
        [phoneRef.current, emailRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 },
        "-=0.5"
      )
      .fromTo(
        socialElements,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
        "-=0.4"
      );

    // Add continuous subtle animation to social icons
    socialElements.forEach((icon) => {
      gsap.to(icon, {
        y: -3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Cleanup function
    return () => {
      if (tl.current) tl.current.kill();
      socialElements.forEach((icon) => {
        gsap.killTweensOf(icon);
      });
    };
  }, []);

  // Function to add social icons to ref array
  const addToSocialRefs = (el) => {
    if (el && !socialRefs.current.includes(el)) {
      socialRefs.current.push(el);
    }
  };

  return (
    <div
      ref={topBarRef}
      className="bg-gradient-to-r from-gray-900 to-[#193cb8] text-white py-3 px-4 w-full shadow-lg"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-2 md:mb-0">
          <div className="flex items-center" ref={phoneRef}>
            <FaPhone className="mr-2 text-blue-300 text-lg" />
            <a
              href="tel:+1234567890"
              className="text-sm font-mono hover:text-blue-300 transition-colors"
            >
              +1(234)567-890
            </a>
          </div>
          <div className="flex items-center" ref={emailRef}>
            <FaEnvelope className="mr-2 text-blue-300 text-lg" />
            <a
              href="mailto:info@example.com"
              className="text-sm font-serif hover:text-blue-300 transition-colors"
            >
              info@example.com
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex space-x-5">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            ref={addToSocialRefs}
          >
            <FaFacebook className="text-xl" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            ref={addToSocialRefs}
          >
            <FaTwitter className="text-xl" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-400 transition-colors"
            ref={addToSocialRefs}
          >
            <FaInstagram className="text-xl" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            ref={addToSocialRefs}
          >
            <FaLinkedin className="text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
