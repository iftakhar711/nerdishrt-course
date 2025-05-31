import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  EyeIcon,
  ArrowLeftIcon,
  TagIcon,
  ShareIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContentVisible, setIsContentVisible] = useState(false);

  // The view count state is for demonstration; a proper implementation
  // would involve a backend call to increment and fetch the view count.
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://nerdishrt-course-server-production.up.railway.app/blogs/${slug}`
        );
        if (!response.ok) throw new Error("Blog not found");
        const data = await response.json();

        setBlog(data);
        setViews(data.views || 0);

        // This is a mock update. In a real app, you would send an update
        // request to your backend to increment the view count.
        setViews((prev) => prev + 1);

        // Trigger content animation after a short delay
        setTimeout(() => setIsContentVisible(true), 300);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const shareArticle = () => {
    if (navigator.share && blog) {
      navigator
        .share({
          title: blog.title,
          text: blog.metaDescription,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback if user cancels share or on error
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    // Optional: Show a "Copied!" message to the user
  };

  // Helper function to get reading time, handling both new and old content formats
  const getReadingTime = (blogPost) => {
    // 1. Prefer the pre-calculated time from the database
    if (blogPost.readingTime) {
      return blogPost.readingTime;
    }

    // 2. Calculate for new, structured content
    if (Array.isArray(blogPost.content)) {
      const allParagraphs = blogPost.content
        .map((section) => section.paragraph || "")
        .join(" ");
      const wordCount = allParagraphs
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      return `${Math.ceil(wordCount / 200)} min read`;
    }

    // 3. Calculate for old, string-based content
    if (typeof blogPost.content === "string") {
      const wordCount = blogPost.content
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      return `${Math.ceil(wordCount / 200)} min read`;
    }

    // 4. Default fallback
    return "1 min read";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back button and action buttons */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-300 group"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to articles
        </button>

        <div className="flex space-x-3">
          <button
            onClick={shareArticle}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Share article"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-700 ease-in-out ${
          isContentVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        {/* Article header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="inline-flex items-center px-3 py-1 bg-indigo-100  text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-semibold">
              {blog.category}
            </span>
            {blog.isFeatured && (
              <span className="inline-flex items-center px-3 py-1 bg-pink-100  text-pink-800 dark:text-pink-200 rounded-full text-sm font-semibold">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900  mb-2 md:mb-3 lg:mb-4 leading-tight">
            {blog.title}
          </h1>

          <p className="text-sm md:text-base lg:text-lg text-gray-900 font-serif  mb-4 md:mb-5 lg:mb-8 max-w-3xl">
            {blog.excerpt || blog.metaDescription}
          </p>

          {/* Author and metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center">
              <div className="flex gap-2 items-center mr-4">
                <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <p className="font-medium text-gray-900 dark:text-white">
                  {blog.author}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 ">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1.5" />
                {new Date(blog.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1.5" />
                {getReadingTime(blog)}
              </div>
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1.5" />
                {views.toLocaleString()} views
              </div>
            </div>
          </div>

          {/* Featured image */}
          {blog.featuredImage && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-cover"
                loading="eager"
              />
            </div>
          )}
        </header>

        {/* Article content */}
        <article className="prose dark:prose-invert prose-indigo prose-lg max-w-none mb-16">
          {/* RENDER NEW STRUCTURED CONTENT */}
          {Array.isArray(blog.content) ? (
            blog.content.map((section, index) => (
              <div key={index}>
                {section.heading && (
                  <h2 className="mb-2 font-bold text-purple-600 text-lg lg:text-xl">
                    {section.heading}
                  </h2>
                )}
                {section.paragraph && (
                  <p className="mb-5 text-sm md:text-base lg:text-lg">
                    {section.paragraph.replace(/\n/g, "<br />")}
                  </p>
                )}
              </div>
            ))
          ) : (
            /* FALLBACK FOR OLD HTML STRING CONTENT */
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          )}
        </article>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 py-8 border-t border-gray-200 dark:border-gray-700">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded text-xs font-bold font-mono bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                <TagIcon className="h-3 w-3 mr-1.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
