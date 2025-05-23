import { useState } from "react";
import {
  ArrowRightIcon,
  CalendarIcon,
  EyeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const BlogCard = ({ blog, onReadMore }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-500 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-700"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            opacity: isHovered ? 0.8 : 0.6,
          }}
        ></div>
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white dark:bg-gray-900 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {blog.category}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {new Date(blog.publishDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            {blog.views} views
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {blog.metaDescription}
        </p>

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
        </div>

        <Link
          to={`/blogs/${blog.slug}`}
          onClick={() => onReadMore(blog.slug)}
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium group"
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
