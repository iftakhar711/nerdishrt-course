import { useState } from "react";
import {
  ArrowRightIcon,
  CalendarIcon,
  EyeIcon,
  TagIcon,
  ClockIcon,
  CheckBadgeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const BlogCard = ({ blog, onReadMore }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determine badge color based on status
  const getStatusBadgeColor = () => {
    switch (blog.status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const Top = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-500 hover:shadow-xl border border-gray-200 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Featured Image with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden">
        {blog.featuredImage ? (
          <>
            <div
              className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700 ${
                imageLoaded ? "opacity-20" : "opacity-60"
              }`}
              style={{
                transform: isHovered ? "scale(1.1)" : "scale(1)",
              }}
            ></div>
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <PhotoIcon className="h-12 w-12 text-white opacity-50" />
          </div>
        )}

        {/* Top-right badges */}
        <div className="absolute top-3 right-3 space-y-2">
          {blog.isFeatured && (
            <div className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
              <CheckBadgeIcon className="h-3 w-3 mr-1" />
              Featured
            </div>
          )}
          <div
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor()}`}
          >
            {blog.status}
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white dark:bg-gray-900 rounded-full text-xs font-semibold text-indigo-600  shadow-sm">
          {blog.category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date(blog.publishDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            {blog.views || 0} views
          </div>
          {blog.readingTime && (
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {blog.readingTime}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className=" font-bold text-gray-900  mb-2 line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm  mb-4 line-clamp-3">
          {blog.excerpt || blog.metaDescription}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{blog.tags.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Read More Link */}
        <Link
          to={`/blogs/${blog.slug}`}
          onClick={() => {
            Top();
            onReadMore && onReadMore(blog.slug);
          }}
          className="inline-flex items-center text-indigo-600  font-medium group"
          style={{
            transform: isHovered ? "translateX(5px)" : "translateX(0)",
            transition: "transform 0.3s ease",
          }}
        >
          Read more
          <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
