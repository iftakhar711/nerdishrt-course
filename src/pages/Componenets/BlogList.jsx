import { useState, useEffect } from "react";
import BlogCard from "../Blogs/BlogCrad";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const FeaturedBlogs = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blogs?limit=3");
        const data = await response.json();
        setFeaturedBlogs(data);
      } catch (error) {
        console.error("Error fetching featured blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <section className="py-8 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-[44px] font-extrabold mb-2">
            <span className="bg-clip-text text-transparent bg-[#6a4c93]">
              Latest Articles
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-black">
            Discover our most recent insights and stories
          </h2>
          <div
            className="w-32 h-1 mt-2 mx-auto bg-[#92ba92] rounded-full"
            style={{ transform: "scaleX(0)", transformOrigin: "left center" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {featuredBlogs.map((blog) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              onReadMore={(slug) => (window.location.href = `/blog/${slug}`)}
            />
          ))}{" "}
          :{" "}
          <h1 className="text-xl md:text-[24px] font-extrabold mx-auto">
            Blogs will come soon
          </h1>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/blogs"
            className="inline-flex items-center px-4 py-3  border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-[#6a4c93]  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:shadow-lg"
          >
            View All Articles
            <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogs;
