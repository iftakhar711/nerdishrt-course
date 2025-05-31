import React, { useEffect, useRef, useState, useContext } from "react";
import { gsap } from "gsap";
import { FaBars, FaTimes, FaUser, FaUserPlus } from "react-icons/fa";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const homeRef = useRef(null);
  const coursesRef = useRef(null);
  const blogRef = useRef(null);
  const faqRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileHomeRef = useRef(null);
  const mobileCoursesRef = useRef(null);
  const mobileBlogRef = useRef(null);
  const mobileFaqRef = useRef(null);
  const toggleRef = useRef(null);
  const authBtnRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Use AuthContext for authentication state
  const { isAuthenticated } = useContext(AuthContext);

  // Initialize animations
  useEffect(() => {
    // Collect desktop menu item refs
    const menuItems = [
      homeRef.current,
      coursesRef.current,
      blogRef.current,
      faqRef.current,
      authBtnRef.current,
    ];

    // Set initial state
    gsap.set([logoRef.current, ...menuItems], {
      opacity: 0,
      y: 20,
    });

    // Logo animation
    gsap.to(logoRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "bounce.out",
      delay: 0.3,
    });

    // Menu items animation with more advanced effects
    menuItems.forEach((item, index) => {
      if (!item) return;

      gsap.to(item, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5 + index * 0.15,
        onComplete: () => {
          // Add the magnetic effect after initial animation
          if (item && item !== authBtnRef.current) {
            item.addEventListener("mousemove", (e) => {
              const { left, top, width, height } = item.getBoundingClientRect();
              const x = (e.clientX - left) / width - 0.5;
              const y = (e.clientY - top) / height - 0.5;
              gsap.to(item, {
                x: x * 10,
                y: y * 5,
                duration: 0.8,
                ease: "power2.out",
              });
            });

            item.addEventListener("mouseleave", () => {
              gsap.to(item, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)",
              });
            });
          }
        },
      });
    });

    // Navbar scroll effect
    // ScrollTrigger.create({
    //   trigger: document.body,
    //   start: "top top",
    //   end: "max",
    //   onUpdate: (self) => {
    //     const scroll = self.scroll();
    //     if (scroll > 50) {
    //       gsap.to(navbarRef.current, {
    //         backgroundColor: "rgba(15, 23, 42, 0.95)",
    //         backdropFilter: "blur(10px)",
    //         boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    //         duration: 0.3,
    //       });
    //     } else {
    //       gsap.to(navbarRef.current, {
    //         backgroundColor: "rgba(15, 23, 42, 1)",
    //         backdropFilter: "blur(0px)",
    //         boxShadow: "none",
    //         duration: 0.3,
    //       });
    //     }
    //   },
    // });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isAuthenticated]); // Add isAuthenticated to dependencies to re-run when auth status changes

  // Mobile menu animations
  useEffect(() => {
    const mobileItems = [
      mobileHomeRef.current,
      mobileCoursesRef.current,
      mobileBlogRef.current,
      mobileFaqRef.current,
    ];

    if (isMenuOpen) {
      // Open animation
      gsap.to(mobileMenuRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.from(mobileItems, {
        x: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
        delay: 0.2,
      });
    } else {
      // Close animation
      gsap.to(mobileMenuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isMenuOpen]);

  // Advanced hover animations for menu items
  const handleHover = (ref) => {
    gsap.to(ref, {
      y: -5,
      color: "#525e75",
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
      scale: 1.05,
    });

    // Create a particle effect
    const particles = 5;
    for (let i = 0; i < particles; i++) {
      const particle = document.createElement("div");
      particle.className =
        "absolute w-1 h-1 rounded-full bg-blue-400 pointer-events-none";
      ref.appendChild(particle);

      gsap.fromTo(
        particle,
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 0.5,
        },
        {
          x: Math.random() * 40 - 20,
          y: Math.random() * -30 - 10,
          opacity: 0,
          scale: 1.5,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            if (ref.contains(particle)) {
              ref.removeChild(particle);
            }
          },
        }
      );
    }
  };

  const handleHoverOut = (ref) => {
    gsap.to(ref, {
      y: 0,
      color: "#000000",
      scale: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const handleAuthAction = () => {
    if (isAuthenticated()) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleRegister = () => {
    navigate("/registration");
  };

  // const handleLogout = () => {
  //   logout();
  //   navigate("/");
  //   setIsMenuOpen(false);
  // };

  return (
    <nav className="w-full bg-gray-50 text-black py-4 px-6  z-50 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          ref={logoRef}
          className="text-2xl font-bold bg-[#6a4c93] bg-clip-text text-transparent"
        >
          Nerdishrt
        </Link>

        {/* Enhanced Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <ul ref={menuRef} className="flex space-x-8">
            <Link
              to="/"
              ref={homeRef}
              onMouseEnter={() => handleHover(homeRef.current)}
              onMouseLeave={() => handleHoverOut(homeRef.current)}
              className="relative cursor-pointer group px-4 py-2 rounded-lg"
            >
              <span className="relative font-mono font-bold z-10">Home</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-500"></span>
            </Link>
            <Link
              to="/courses"
              ref={coursesRef}
              onMouseEnter={() => handleHover(coursesRef.current)}
              onMouseLeave={() => handleHoverOut(coursesRef.current)}
              className="relative cursor-pointer group px-4 py-2 rounded-lg"
            >
              <span className="relative font-mono font-bold z-10">Courses</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-500"></span>
            </Link>
            <Link
              to="/blogs"
              ref={blogRef}
              onMouseEnter={() => handleHover(blogRef.current)}
              onMouseLeave={() => handleHoverOut(blogRef.current)}
              className="relative cursor-pointer group px-4 py-2 rounded-lg"
            >
              <span className="relative font-mono font-bold z-10">Blogs</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-500"></span>
            </Link>

            <Link
              to="/faq"
              ref={faqRef}
              onMouseEnter={() => handleHover(faqRef.current)}
              onMouseLeave={() => handleHoverOut(faqRef.current)}
              className="relative cursor-pointer group px-4 py-2 rounded-lg"
            >
              <span className="relative font-mono font-bold z-10">FAQ</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-400 transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-500"></span>
            </Link>
          </ul>

          {/* Dynamic Auth Button */}
          <div ref={authBtnRef} className="relative">
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAuthAction}
                  className="flex items-center text-white space-x-2 px-4 py-2 bg-[#6a4c93] rounded-full hover:shadow-lg transition-all duration-300 group"
                >
                  <FaUser className="text-white" />
                  <span className="font-medium">Profile</span>
                  <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </button>
                {/* <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  Logout
                </button> */}
              </div>
            ) : (
              <>
                {/* <button
                  onClick={handleAuthAction}
                  className="flex items-center space-x-2 px-4 py-2 hover:text-blue-400 transition-colors mr-4"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </button> */}
                <button
                  onClick={handleRegister}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#6a4c93] rounded-full hover:shadow-lg transition-all duration-300 group"
                >
                  <FaUserPlus className="text-white" />
                  <span className="font-medium text-white">Register</span>
                  <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          ref={toggleRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu - Explicit Items */}
      <div
        ref={mobileMenuRef}
        className="md:hidden z-50 fixed top-0 right-0 h-full w-64 bg-gray-50  shadow-xl transform translate-x-full opacity-0"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <ul className="flex flex-col space-y-6">
            <Link
              to="/"
              ref={mobileHomeRef}
              className="text-xl border-b font-mono font-bold border-slate-700 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/courses"
              ref={mobileCoursesRef}
              className="text-xl border-b font-mono font-bold border-slate-700 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/blogs"
              ref={mobileBlogRef}
              className="text-xl border-b font-mono font-bold border-slate-700 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              to="/faq"
              ref={mobileFaqRef}
              className="text-xl border-b font-mono font-bold border-slate-700 pb-2"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
          </ul>

          {/* Mobile Auth Button */}
          <div className="pt-6 border-t border-slate-700">
            {isAuthenticated() ? (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    handleAuthAction();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <FaUser className="text-white" />
                  <span className="font-medium">Profile</span>
                </button>
                {/* <button
                  onClick={handleLogout}
                  className="w-full text-red-400 hover:text-red-300 transition-colors duration-300 text-center"
                >
                  Logout
                </button> */}
              </div>
            ) : (
              <>
                {/* <button
                  onClick={() => {
                    handleAuthAction();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 mb-4 hover:text-blue-400 transition-colors"
                >
                  <FaSignInAlt />
                  <span>Login</span>
                </button> */}
                <button
                  onClick={() => {
                    handleRegister();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#6a4c93] rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <FaUserPlus className="text-white" />
                  <span className="font-medium text-white">Register</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
