import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditCourseForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    icon: "",
    bgColorClass: "",
    fee: 0,
    duration: "",
    session: "",
    category: "",
    minimum_age: 33,
    assessment: "",
    resultCertificate: "",
    earnings: "",
    siaLicenceFee: "",
    additionalCharges: "",
    entryRequirement: "",
    teachingMethod: "",
    content: [],
    faq: [],
    isFeatured: false,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        const foundCourse = data.courses.find((c) => c.slug === slug);

        if (!foundCourse) {
          throw new Error("Course not found");
        }

        setCourse(foundCourse);
        setFormData({
          title: foundCourse.title,
          slug: foundCourse.slug,
          icon: foundCourse.icon,
          bgColorClass: foundCourse.bgColorClass,
          fee: foundCourse.fee,
          duration: foundCourse.duration,
          session: foundCourse.session,
          category: foundCourse.category,
          minimum_age: foundCourse.minimum_age,
          assessment: foundCourse.assessment,
          resultCertificate: foundCourse.resultCertificate,
          earnings: foundCourse.earnings,
          siaLicenceFee: foundCourse.siaLicenceFee,
          additionalCharges: foundCourse.additionalCharges,
          entryRequirement: foundCourse.entryRequirement,
          teachingMethod: foundCourse.teachingMethod,
          content: foundCourse.content || [],
          faq: foundCourse.faq || [],
          isFeatured: foundCourse.isFeatured || false,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (index, value) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const addContentField = () => {
    setFormData((prev) => ({ ...prev, content: [...prev.content, ""] }));
  };

  const removeContentField = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaq = [...formData.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const addFaqField = () => {
    setFormData((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const removeFaqField = (index) => {
    const newFaq = formData.faq.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, faq: newFaq }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/courses/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/courses");
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Edit Course: {course?.title}
      </h1>

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Course updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Background Color Class
              </label>
              <input
                type="text"
                name="bgColorClass"
                value={formData.bgColorClass}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Is Featured
              </label>
              <div className="mt-1">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Pricing & Duration
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fee (£)
              </label>
              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session
              </label>
              <input
                type="text"
                name="session"
                value={formData.session}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Age
              </label>
              <input
                type="number"
                name="minimum_age"
                value={formData.minimum_age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assessment
              </label>
              <input
                type="text"
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Result Certificate
              </label>
              <input
                type="text"
                name="resultCertificate"
                value={formData.resultCertificate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
              />
            </div>
          </div>
        </div>

        {/* Earnings & Charges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Earnings
            </label>
            <input
              type="text"
              name="earnings"
              value={formData.earnings}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SIA Licence Fee
            </label>
            <input
              type="text"
              name="siaLicenceFee"
              value={formData.siaLicenceFee}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Charges
            </label>
            <input
              type="text"
              name="additionalCharges"
              value={formData.additionalCharges}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
            />
          </div>
        </div>

        {/* Requirements & Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Entry Requirement
            </label>
            <textarea
              name="entryRequirement"
              value={formData.entryRequirement}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teaching Method
            </label>
            <textarea
              name="teachingMethod"
              value={formData.teachingMethod}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
            />
          </div>
        </div>

        {/* Course Content */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Course Content
          </h2>
          {formData.content.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleContentChange(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
              />
              <button
                type="button"
                onClick={() => removeContentField(index)}
                className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addContentField}
            className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Add Content Item
          </button>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">FAQ</h2>
          {formData.faq.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Answer
                </label>
                <textarea
                  value={item.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFaqField(index)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Remove FAQ
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFaqField}
            className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Add FAQ
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCourseForm;
