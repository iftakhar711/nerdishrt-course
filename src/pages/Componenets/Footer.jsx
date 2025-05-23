import { useState } from "react";
import { GiTopaz } from "react-icons/gi";
import { Link } from "react-router-dom";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const trainingVenues = [
    "BARKING",
    "SOUTHALL",
    "UPMINISTER",
    "WIMBLEDON",
    "WOOLWICH",
    "CROYDON",
    "HARROW",
    "HOUNSLOW",
    "SURREY",
    "ENFIELD",
    "WEMBLEY",
    "LEWISHAM",
    "ILFORD",
    "WOODGREEN",
    "STOCKWELL",
    "HAMMERSMITH",
    "BOW",
    "BETHNAL GREEN",
  ];

  const [visibleVenues, setVisibleVenues] = useState(8);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gray-50 text-white pt-6 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Contact Form */}
          <div className="animate-slideUp">
            <h3
              className="text-2xl font-bold mb-4 text-black relative pb-2 
              after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-cyan-400 after:animate-underline"
            >
              Get in Touch
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2.5 rounded-md bg-[#525e75] border border-gray-600 
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                    transition-all duration-300"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2.5 rounded-md bg-[#525e75] border border-gray-600 
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                    transition-all duration-300"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full p-2.5 rounded-md bg-[#525e75] border border-gray-600 
                    focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                    transition-all duration-300"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <textarea
                placeholder="Your Message..."
                className="w-full p-2.5 rounded-md bg-[#525e75] border border-gray-600 
                  focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 
                  transition-all duration-300"
                rows={3}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#6a4c93] hover:bg-cyan-600 text-white font-semibold 
                  px-6 py-2.5 rounded-md transition-all duration-300 transform hover:scale-[1.02] 
                  shadow-lg hover:shadow-cyan-500/20"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Training Venues */}
          <div className="animate-slideUp delay-100">
            <h3
              className="text-2xl font-bold mb-4 text-black relative pb-2 
              after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-cyan-400 after:animate-underline"
            >
              Training Centers
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {trainingVenues.slice(0, visibleVenues).map((venue, index) => (
                <div
                  key={index}
                  className="p-2 text-sm bg-[#525e75] rounded-md hover:bg-cyan-500 
                    transition-all duration-300 cursor-pointer transform hover:scale-[1.02] 
                    flex items-center"
                >
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
                  {venue}
                </div>
              ))}
              <button
                onClick={() =>
                  setVisibleVenues((prev) =>
                    prev === 8 ? trainingVenues.length : 8
                  )
                }
                className="col-span-2 text-black hover:text-cyan-300 text-sm mt-2 
                   duration-300"
              >
                {visibleVenues === 8 ? "Show All Locations →" : "Show Less"}
              </button>
            </div>
          </div>

          {/* Quick Links & Contact */}
          <div className="animate-slideUp delay-200">
            <h3
              className="text-2xl font-bold mb-4 text-black relative pb-2 
              after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-cyan-400 after:animate-underline"
            >
              Quick Connect
            </h3>
            <div className="space-y-4">
              <div className="bg-[#525e75] p-4 rounded-md hover:bg-gray-600 transition-colors duration-300">
                <h4 className="font-semibold mb-2">Head Office</h4>
                <address className="not-italic text-sm">
                  <p>1 A For Security</p>
                  <p>2nd Floor, 465A Bethnal Green Road</p>
                  <p>London E2 9QW</p>
                  <p className="mt-2">
                    Tel:{" "}
                    <a
                      href="tel:02089800000"
                      className="text-white hover:text-cyan-300"
                    >
                      02089802934
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="info@NerdishrtSecurity.uk"
                      className="text-white hover:text-cyan-300"
                    >
                      info@NerdishrtSecurity.uk
                    </a>
                  </p>
                </address>
              </div>

              <ul className="grid grid-cols-2 gap-2">
                <li>
                  <Link
                    to="/"
                    onClick={top}
                    className="block w-full p-3 text-sm font-medium text-white text-center 
                 bg-[#525e75] rounded-md hover:bg-cyan-500 transition-all duration-300"
                  >
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    to="courses"
                    onClick={top}
                    className="block w-full p-3 text-sm font-medium text-white text-center 
                 bg-[#525e75] rounded-md hover:bg-cyan-500 transition-all duration-300"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="registration"
                    onClick={top}
                    className="block w-full p-3 text-sm font-medium text-white text-center 
                 bg-[#525e75] rounded-md hover:bg-cyan-500 transition-all duration-300"
                  >
                    Registration
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={top}
                    className="block w-full p-3 text-sm font-medium text-white text-center 
                 bg-[#525e75] rounded-md hover:bg-cyan-500 transition-all duration-300"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-8 text-center">
          <p className="text-sm font-bold text-black">
            © {new Date().getFullYear()} NerdishrtSecurity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
