import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DocumentTextIcon,
  LinkIcon,
  TagIcon,
  CalendarIcon,
  UserIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const API_BASE_URL = "https://nerdishrt-course-server.onrender.com/api"; // Make sure this matches your backend URL

const EditBlogForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaDescription: "",
    content: "",
    category: "",
    tags: "",
    author: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSlugWarning, setShowSlugWarning] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFormData({
            title: data.title,
            slug: data.slug,
            metaDescription: data.metaDescription,
            content: data.content,
            category: data.category,
            tags: data.tags.join(", "),
            author: data.author,
          });
        } catch (error) {
          console.error("Error fetching blog:", error);
          setSubmitError(`Failed to load blog: ${error.message}`);
        }
      };
      fetchBlog();
    }
  }, [isEdit, slug]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && !isEdit) {
      const generatedSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: generatedSlug,
      }));
      setShowSlugWarning(formData.slug !== generatedSlug);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.metaDescription.trim())
      newErrors.metaDescription = "Meta description is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.tags.trim()) newErrors.tags = "At least one tag is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const url = isEdit
        ? `${API_BASE_URL}/blogs/${slug}`
        : `${API_BASE_URL}/blogs`;
      const method = isEdit ? "PUT" : "POST";

      const dataToSend = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `Server responded with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log(data);

      navigate(`/blog/${formData.slug}`);
    } catch (error) {
      console.error("Error saving blog:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 transition-colors duration-300"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {isEdit ? "Edit Blog Post" : "Create New Blog Post"}
      </h2>

      {/* Error Message */}
      {submitError && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{submitError}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Enter blog title"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              URL Slug
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                onFocus={() => setShowSlugWarning(true)}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.slug
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="e.g., my-awesome-blog"
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
            {showSlugWarning && !isEdit && (
              <p className="mt-1 text-sm text-yellow-600">
                Note: Changing the slug manually may affect SEO. The slug is
                automatically generated from the title.
              </p>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label
              htmlFor="metaDescription"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Meta Description (SEO)
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              rows="3"
              value={formData.metaDescription}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.metaDescription
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="A brief description for search engines (160 characters max)"
              maxLength="160"
            />
            {errors.metaDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.metaDescription}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.metaDescription.length}/160 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="e.g., Technology, Business, Lifestyle"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tags
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.tags
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Comma separated tags (e.g., react, javascript, webdev)"
              />
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Author
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.author
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Author name"
              />
            </div>
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="12"
              value={formData.content}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.content
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Write your blog content here (HTML or Markdown)"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : isEdit ? (
              "Update Post"
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogForm;
