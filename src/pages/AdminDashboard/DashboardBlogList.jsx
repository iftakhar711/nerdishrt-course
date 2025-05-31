import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import DeleteConfirmation from "./DeleteConModal";

const DashboardBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    blogId: null,
    blogTitle: "",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://nerdishrt-course-server-production.up.railway.app/blogs"
        );
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async () => {
    try {
      await fetch(
        `https://nerdishrt-course-server-production.up.railway.app/blogs/${deleteModal.blogId}`,
        {
          method: "DELETE",
        }
      );

      setBlogs(blogs.filter((blog) => blog.slug !== deleteModal.blogId));
      setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" });
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Blog Posts
        </h1>
        <Link
          to="/dashboard/addblog"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Post
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {blogs.map((blog) => (
            <li
              key={blog.slug}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                        {blog.title}
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {blog.category}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {new Date(blog.publishDate).toLocaleDateString()}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <EyeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {blog.views} views
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <Link
                      to={`/blogs/${blog.slug}`}
                      target="_blank"
                      className="p-2 rounded-full text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="View"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    <Link
                      to={`/dashboard/editblog/${blog.slug}`}
                      className="p-2 rounded-full text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          blogId: blog.slug,
                          blogTitle: blog.title,
                        })
                      }
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, blogId: null, blogTitle: "" })
        }
        onConfirm={handleDelete}
        blogTitle={deleteModal.blogTitle}
      />
    </div>
  );
};

export default DashboardBlogList;
