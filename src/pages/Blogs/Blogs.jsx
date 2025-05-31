import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "./BlogCard";
import {
  SparklesIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTags, setActiveTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const tagContainerRef = useRef(null);
  const heroRef = useRef(null);

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollValue = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollValue * 0.2}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server-production.up.railway.app/blogs"
        );
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleCardClick = (slug) => {
    navigate(`/blogs/${slug}`);
  };

  // Get all unique tags
  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];

  // Filter blogs based on active tags and search query
  const filteredBlogs = blogs.filter((blog) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    // Tag filter
    const matchesTags =
      activeTags.length === 0 ||
      (blog.tags && activeTags.some((tag) => blog.tags.includes(tag)));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Scroll animation for tag container
  useEffect(() => {
    const container = tagContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const atStart = scrollLeft === 0;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      container.style.setProperty(
        "--scroll-position",
        atStart ? "start" : atEnd ? "end" : "middle"
      );
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div class="w-32 aspect-square rounded-full relative flex justify-center items-center animate-[spin_3s_linear_infinite] z-40 bg-[conic-gradient(white_0deg,white_300deg,transparent_270deg,transparent_360deg)] before:animate-[spin_2s_linear_infinite] before:absolute before:w-[60%] before:aspect-square before:rounded-full before:z-[80] before:bg-[conic-gradient(white_0deg,white_270deg,transparent_180deg,transparent_360deg)] after:absolute after:w-3/4 after:aspect-square after:rounded-full after:z-[60] after:animate-[spin_3s_linear_infinite] after:bg-[conic-gradient(#065f46_0deg,#065f46_180deg,transparent_180deg,transparent_360deg)]">
          <span class="absolute w-[85%] aspect-square rounded-full z-[60] animate-[spin_5s_linear_infinite] bg-[conic-gradient(#34d399_0deg,#34d399_180deg,transparent_180deg,transparent_360deg)]"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* <div
          ref={heroRef}
          className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10 dark:opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 20%),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 20%)
            `,
            transition: "transform 0.1s ease-out",
          }}
        ></div> */}

        <div className=" mx-auto py-10 px-4  lg:px-8  text-center relative">
          {/* <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-indigo-400/10 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-purple-400/10 blur-xl"></div> */}

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900  mb-6">
            <span className="relative inline-block">
              <span className="relative z-10 bg-clip-text text-transparent bg-[#6a4c93]">
                Blog Insights
              </span>
              <span
                className="absolute -bottom-2 left-0 w-full h-3 bg-[#525e75]  opacity-60"
                style={{
                  transform: "skewX(-15deg)",
                  animation: "underlinePulse 4s ease-in-out infinite",
                }}
              ></span>
            </span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-md lg:text-xl font-semibold font-sans text-gblack ">
            Explore fresh insights, expert tutorials, and the latest industry
            trends.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative">
          {/* Gradient overlays for scroll indication */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10"></div>

          <div
            ref={tagContainerRef}
            className="flex space-x-3 pb-4 overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              maskImage:
                "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)",
            }}
          >
            <button
              onClick={() => setActiveTags([])}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                activeTags.length === 0
                  ? "bg-[#6a4c93] text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {activeTags.length === 0 && (
                <SparklesIcon className="w-4 h-4 mr-2 animate-pulse" />
              )}
              All Articles
            </button>

            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${
                  activeTags.includes(tag)
                    ? "bg-[#6a4c93] text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {activeTags.includes(tag) && (
                  <SparklesIcon
                    className="w-4 h-4 mr-2 animate-spin"
                    style={{ animationDuration: "2s" }}
                  />
                )}
                {tag}
              </button>
            ))}
          </div>

          {/* Active tags indicator */}
          {activeTags.length > 0 && (
            <div className="flex items-center justify-center mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                Active filters:
              </span>
              <div className="flex flex-wrap gap-2">
                {activeTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#6a4c93]  text-white"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setActiveTags([])}
                  className="text-xs text-indigo-600  hover:text-indigo-800  flex items-center"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredBlogs.length > 0 ? (
          <>
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : activeTags.length > 0
                  ? `Articles tagged with ${activeTags.join(", ")}`
                  : "Latest Articles"}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredBlogs.length}{" "}
                {filteredBlogs.length === 1 ? "article" : "articles"} found
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <div
                  key={blog._id}
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${
                      index * 0.1
                    }s forwards`,
                    opacity: 0,
                  }}
                >
                  <BlogCard
                    blog={blog}
                    onClick={() => handleCardClick(blog.slug)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-indigo-500 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {searchQuery
                  ? `We couldn't find any articles matching "${searchQuery}"`
                  : activeTags.length > 0
                  ? "No articles match all selected tags. Try adjusting your filters."
                  : "We couldn't find any articles at the moment. Please check back later."}
              </p>
              <div className="flex justify-center gap-3">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-4 py-2 text-sm font-medium text-indigo-600  hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    Clear search
                  </button>
                )}
                {activeTags.length > 0 && (
                  <button
                    onClick={() => setActiveTags([])}
                    className="px-4 py-2 text-sm font-medium text-indigo-600  hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                  >
                    Clear all tags
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes underlinePulse {
          0%,
          100% {
            width: 100%;
            opacity: 0.6;
          }
          50% {
            width: 110%;
            opacity: 0.3;
          }
        }
        @keyframes progress {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Blogs;
