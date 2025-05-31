import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const CourseForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    icon: "⭐",
    fee: "",
    duration: "",
    session: "",
    category: "",
    bgColorClass: "from-blue-400 to-blue-600",
    minimum_age: "",
    assessment: "",
    resultCertificate: "",
    earnings: "",
    siaLicenceFee: "",
    additionalCharges: "",
    entryRequirement: "",
    teachingMethod: "",
    overview: "",
    isFeatured: false,
  });

  const [contentList, setContentList] = useState([""]);
  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({});

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "nerishert_preset"); // Replace with your upload preset
    formData.append("cloud_name", "dsdtch8zr"); // Replace with your cloud name

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsdtch8zr/image/upload`, // Replace with your cloud name
        {
          method: "POST",
          body: formData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMsg("Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Shake animation effect
  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (index, value) => {
    const updated = [...contentList];
    updated[index] = value;
    setContentList(updated);
  };

  const addContentField = () => setContentList((prev) => [...prev, ""]);

  const removeContentField = (index) => {
    setContentList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index, field, value) => {
    const updated = [...faqList];
    updated[index][field] = value;
    setFaqList(updated);
  };

  const addFaqField = () =>
    setFaqList((prev) => [...prev, { question: "", answer: "" }]);

  const removeFaqField = (index) => {
    setFaqList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setErrors({});

    // Validate required fields
    let newErrors = {};
    const {
      title,
      slug,
      short_description,
      fee,
      duration,
      session,
      minimum_age,
      category,
      bgColorClass,
      overview,
    } = formData;

    if (!title.trim()) newErrors.title = "Title is required";
    if (!slug.trim()) newErrors.slug = "Slug is required";
    if (!short_description.trim())
      newErrors.short_description = "Short description is required";
    if (!fee || isNaN(fee)) newErrors.fee = "Valid Fee is required";
    if (!category) newErrors.category = "Category is required";
    if (!bgColorClass.trim())
      newErrors.bgColorClass = "Background Gradient is required";
    if (!duration.trim()) newErrors.duration = "Duration is required";
    if (!session.trim()) newErrors.session = "Session is required";
    if (!minimum_age || isNaN(minimum_age))
      newErrors.minimum_age = "Valid Minimum Age is required";
    if (!overview.trim()) newErrors.overview = "Course overview is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMsg("Please fix the errors below.");
      setShake(true);
      return;
    }

    try {
      setLoading(true);

      // Upload image first if selected
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }

      const payload = {
        ...formData,
        imageUrl, // Add the Cloudinary image URL
        fee: parseFloat(fee),
        minimum_age: parseInt(minimum_age),
        content: contentList.filter((item) => item.trim() !== ""),
        faq: faqList.filter((faq) => faq.question.trim() || faq.answer.trim()),
      };

      const response = await fetch(
        "https://nerdishrt-course-server-production.up.railway.app/courses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setSuccessMsg("Course created successfully!");
      // Reset form
      setFormData({
        title: "",
        slug: "",
        short_description: "",
        icon: "⭐",
        bgColorClass: "from-blue-400 to-blue-600",
        fee: "",
        duration: "",
        session: "",
        category: "",
        minimum_age: "",
        assessment: "",
        resultCertificate: "",
        earnings: "",
        siaLicenceFee: "",
        additionalCharges: "",
        entryRequirement: "",
        teachingMethod: "",
        overview: "",
        isFeatured: false,
      });
      setContentList([""]);
      setFaqList([{ question: "", answer: "" }]);
      setImageFile(null);
      setImagePreview("");
      setErrors({});
    } catch (err) {
      console.error("Error creating course:", err);
      setErrorMsg(err.message || "Failed to create course. Please try again.");
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-2xl my-8 transition-transform duration-300 ${
        shake ? "animate-shake" : ""
      }`}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Create New Course
      </h2>

      {/* Status Messages */}
      {successMsg && (
        <div className="flex items-center bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
          <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
          <span className="text-green-700">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3" />
          <span className="text-red-700">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Basics Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Course Basics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Add Course"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.slug ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="add-course"
              />
              {errors.slug && (
                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.short_description
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder=""
              />
              {errors.short_description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.short_description}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Category</option>
                <option value="Security">Security</option>
                <option value="Safety">Safety</option>
                <option value="Compliance">Compliance</option>
                <option value="First Aid">First Aid</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Background Gradient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Gradient <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bgColorClass"
                value={formData.bgColorClass}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bgColorClass ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="from-blue-500 to-blue-600"
              />
              {errors.bgColorClass && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.bgColorClass}
                </p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (Emoji)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl"
                placeholder="⭐"
              />
            </div>

            {/* Featured Course */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Featured Course
              </label>
            </div>
          </div>
        </div>

        {/* Course Image Upload */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Course Image
          </h3>
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Course preview"
                  className="w-full h-64 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <CloudArrowUpIcon className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Course Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Course Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee (£) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fee ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="120"
              />
              {errors.fee && (
                <p className="text-red-500 text-sm mt-1">{errors.fee}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="3 Days"
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Session */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="session"
                value={formData.session}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.session ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="9:30 - 10:30"
              />
              {errors.session && (
                <p className="text-red-500 text-sm mt-1">{errors.session}</p>
              )}
            </div>

            {/* Minimum Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minimum_age"
                value={formData.minimum_age}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.minimum_age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="18"
              />
              {errors.minimum_age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minimum_age}
                </p>
              )}
            </div>

            {/* Assessment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assessment
              </label>
              <input
                type="text"
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Written Exam, Practical Test"
              />
            </div>

            {/* Result Certificate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Result Certificate
              </label>
              <input
                type="text"
                name="resultCertificate"
                value={formData.resultCertificate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Certificate of Completion"
              />
            </div>

            {/* Earnings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Potential Earnings
              </label>
              <input
                type="text"
                name="earnings"
                value={formData.earnings}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="£15-£20/hour"
              />
            </div>

            {/* SIA Licence Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SIA Licence Fee
              </label>
              <input
                type="text"
                name="siaLicenceFee"
                value={formData.siaLicenceFee}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="£210"
              />
            </div>

            {/* Additional Charges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Charges
              </label>
              <input
                type="text"
                name="additionalCharges"
                value={formData.additionalCharges}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="None"
              />
            </div>

            {/* Entry Requirement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Requirement
              </label>
              <input
                type="text"
                name="entryRequirement"
                value={formData.entryRequirement}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="English language proficiency"
              />
            </div>

            {/* Teaching Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teaching Method
              </label>
              <input
                type="text"
                name="teachingMethod"
                value={formData.teachingMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Classroom, Online"
              />
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Course Overview <span className="text-red-500">*</span>
          </h3>
          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            rows="5"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.overview ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Provide a brief overview of the course..."
          ></textarea>
          {errors.overview && (
            <p className="text-red-500 text-sm mt-1">{errors.overview}</p>
          )}
        </div>

        {/* Course Content */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Course Content
          </h3>
          <div className="space-y-4">
            {contentList.map((content, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1">
                  <textarea
                    value={content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    rows="2"
                    placeholder={`Content point ${index + 1}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeContentField(index)}
                  className="mt-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove content item"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addContentField}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PhotoIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Add Content Item
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqList.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 bg-white"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    FAQ #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaqField(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Remove FAQ"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <textarea
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-y"
                  rows="3"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addFaqField}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PhotoIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Add FAQ
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || isUploading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Creating Course...
              </>
            ) : (
              "Create Course"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
