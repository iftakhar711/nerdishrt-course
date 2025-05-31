import React, { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const TestimonialAdminPanel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://nerdishrt-course-server-production.up.railway.app/admin/testimonials"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }

        const data = await response.json();

        // Ensure data is an array before setting state
        if (Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const approveTestimonial = async (id) => {
    try {
      const response = await fetch(
        `https://nerdishrt-course-server-production.up.railway.app/admin/testimonials/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve testimonial");
      }

      // Update local state
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? { ...t, approved: true } : t))
      );
    } catch (err) {
      console.error("Error approving testimonial:", err);
      setError(err.message);
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      const response = await fetch(
        `https://nerdishrt-course-server-production.up.railway.app/admin/testimonials/${id}`,
        {
          method: "DELETE",
          headers: {
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete testimonial");
      }

      // Update local state
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError(err.message);
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading testimonials...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Testimonial Management</h1>

      {testimonials.length === 0 ? (
        <p className="text-center py-8">No testimonials found</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <tr key={testimonial._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {testimonial.name}
                  </td>
                  <td className="px-6 py-4 max-w-xs">{testimonial.review}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.stars
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        testimonial.approved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {testimonial.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    {!testimonial.approved && (
                      <button
                        onClick={() => approveTestimonial(testimonial._id)}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => deleteTestimonial(testimonial._id)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestimonialAdminPanel;
