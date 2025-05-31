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
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const EditBlogForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaDescription: "",
    excerpt: "",
    category: "",
    tags: "",
    author: "",
    featuredImage: "",
    status: "draft",
    readingTime: "",
    isFeatured: false,
    seoTitle: "",
    seoKeywords: "",
  });

  // State for structured content (replaces the old faqList)
  const [contentSections, setContentSections] = useState([
    { heading: "", paragraph: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSlugWarning, setShowSlugWarning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Effect to handle fetching data for the edit form
  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          const response = await fetch(
            `https://nerdishrt-course-server-production.up.railway.app/blogs/${slug}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFormData({
            title: data.title,
            slug: data.slug,
            metaDescription: data.metaDescription,
            excerpt: data.excerpt || "",
            category: data.category,
            tags: data.tags.join(", "),
            author: data.author,
            featuredImage: data.featuredImage || "",
            status: data.status || "draft",
            readingTime: data.readingTime || "",
            isFeatured: data.isFeatured || false,
            seoTitle: data.seoTitle || "",
            seoKeywords: (data.seoKeywords || []).join(", "),
          });

          // Populate the content sections
          if (Array.isArray(data.content) && data.content.length > 0) {
            setContentSections(data.content);
          } else if (typeof data.content === "string") {
            // For backward compatibility with single string content
            setContentSections([{ heading: "", paragraph: data.content }]);
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
          setSubmitError(`Failed to load blog: ${error.message}`);
        }
      };
      fetchBlog();
    }
  }, [isEdit, slug]);

  // Effect to calculate reading time whenever content changes
  useEffect(() => {
    const calculateReadingTime = (content) => {
      const wordsPerMinute = 200;
      const wordCount = content
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      return Math.ceil(wordCount / wordsPerMinute);
    };

    const allParagraphs = contentSections
      .map((section) => section.paragraph)
      .join(" ");
    const time = calculateReadingTime(allParagraphs);
    setFormData((prev) => ({ ...prev, readingTime: `${time} min read` }));
  }, [contentSections]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // remove non-word chars, but keep hyphens
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title" && !isEdit) {
      const generatedSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        slug: generatedSlug,
        seoTitle: prev.seoTitle || value, // Auto-fill SEO title if it's empty
      }));
      setShowSlugWarning(formData.slug !== generatedSlug);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setSubmitError("Please upload a valid image (JPEG, PNG, GIF, or WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSubmitError("Image size should be less than 5MB");
      return;
    }

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      setIsUploading(true);
      setSubmitError(null);
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=e9a6e6cdc31b1669d52e7e3aa339854c",
        {
          method: "POST",
          body: imageFormData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        featuredImage: data.data.url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setSubmitError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFeaturedImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.metaDescription.trim())
      newErrors.metaDescription = "Meta description is required";
    if (contentSections.every((section) => !section.paragraph.trim()))
      newErrors.content = "At least one content paragraph is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.tags.trim()) newErrors.tags = "At least one tag is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (!formData.featuredImage)
      newErrors.featuredImage = "Featured image is required";

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
        ? `https://nerdishrt-course-server-production.up.railway.app/blogs/${slug}`
        : "https://nerdishrt-course-server-production.up.railway.app/blogs";
      const method = isEdit ? "PUT" : "POST";

      const dataToSend = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        seoKeywords: formData.seoKeywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter((k) => k), // Filter out empty strings
        content: contentSections, // Send the structured content
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
      console.log("Blog saved successfully:", data);

      navigate(`/blogs/${formData.slug}`);
    } catch (error) {
      console.error("Error saving blog:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Content Section Handlers ---
  const handleContentChange = (index, field, value) => {
    const updated = [...contentSections];
    updated[index][field] = value;
    setContentSections(updated);
  };

  const addContentSection = () =>
    setContentSections((prev) => [...prev, { heading: "", paragraph: "" }]);

  const removeContentSection = (index) => {
    if (contentSections.length > 1) {
      // Prevent removing the last item
      setContentSections((prev) => prev.filter((_, i) => i !== index));
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
          {/* Status and Featured Toggle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isFeatured"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                Featured Post
              </label>
            </div>
          </div>

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

          {/* SEO Title */}
          <div>
            <label
              htmlFor="seoTitle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              SEO Title (Optional)
              <span className="text-xs text-gray-500 ml-1">
                (60 characters max)
              </span>
            </label>
            <input
              type="text"
              id="seoTitle"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              maxLength="60"
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Custom title for search engines"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.seoTitle.length}/60 characters
            </p>
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

          {/* Featured Image */}
          <div>
            <label
              htmlFor="featuredImage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Featured Image
            </label>
            {formData.featuredImage ? (
              <div className="relative group">
                <img
                  src={formData.featuredImage}
                  alt="Featured preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeFeaturedImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div
                className={`flex justify-center px-6 pt-5 pb-6 border-2 ${
                  errors.featuredImage
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } border-dashed rounded-lg`}
              >
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                    <label
                      htmlFor="featuredImage-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload an image</span>
                      <input
                        id="featuredImage-upload"
                        name="featuredImage"
                        type="file"
                        onChange={handleImageUpload}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF, WEBP up to 5MB
                  </p>
                </div>
              </div>
            )}
            {errors.featuredImage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.featuredImage}
              </p>
            )}
            {isUploading && (
              <p className="mt-1 text-sm text-blue-600">Uploading image...</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Excerpt
              <span className="text-xs text-gray-500 ml-1">
                (Short summary for preview)
              </span>
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="3"
              value={formData.excerpt}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.excerpt
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="A short summary of your blog post"
              maxLength="300"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {formData.excerpt.length}/300 characters
            </p>
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

          {/* SEO Keywords */}
          <div>
            <label
              htmlFor="seoKeywords"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              SEO Keywords (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="seoKeywords"
                name="seoKeywords"
                value={formData.seoKeywords}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Comma separated keywords (e.g., react, javascript, webdev)"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`block w-full px-3 py-2 border ${
                errors.category
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Security">Security</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Safety">Safety</option>
              <option value="First Aid">First Aid</option>
            </select>
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

          {/* Reading Time */}
          {formData.readingTime && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-4 w-4 mr-1" />
              Estimated reading time: {formData.readingTime}
            </div>
          )}

          {/* --- Content Sections --- */}
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Content
            </h3>
            <div className="space-y-4">
              {contentSections.map((section, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content Section #{index + 1}
                    </span>
                    {contentSections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContentSection(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove Section"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Content Heading (Optional)"
                    value={section.heading}
                    onChange={(e) =>
                      handleContentChange(index, "heading", e.target.value)
                    }
                    className="w-full px-3 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <textarea
                    placeholder="Content Paragraph"
                    value={section.paragraph}
                    onChange={(e) =>
                      handleContentChange(index, "paragraph", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows="5"
                  />
                </div>
              ))}
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
              <button
                type="button"
                onClick={addContentSection}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Add Content Section
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <CalendarIcon className="h-4 w-4 inline mr-1" />
            {isEdit ? "Last updated on " : "Publishing on "}
            {new Date().toLocaleDateString()}
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
              disabled={isSubmitting || isUploading}
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
                  {isEdit ? "Updating..." : "Publishing..."}
                </>
              ) : isEdit ? (
                "Update Post"
              ) : (
                "Publish Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditBlogForm;
