import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home";
import FAQ from "../pages/FAQ/FAQ";
import Courses from "../pages/Courses/Courses";
import CourseDetail from "../pages/Courses/CourseDetail";
import Registration from "../pages/Registration/Registration";
import Login from "../pages/Registration/Login";
import Profile from "../pages/Registration/profile";
import PrivateRoute from "./PrivateRouets";
import DashboardLayout from "../Layout/DashboardLayout";
import AdminLogin from "../pages/AdminDashboard/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import CoursesList from "../pages/AdminDashboard/CourseList";
import CourseForm from "../pages/AdminDashboard/CourseForm";
import EditCourseForm from "../pages/AdminDashboard/EditCourseForm";
import EditBlogForm from "../pages/AdminDashboard/EditBlogForm";
import BlogDetail from "../pages/Blogs/BlogDetail";
import Blogs from "../pages/Blogs/Blogs";
import BlogList from "../pages/AdminDashboard/DashboardBlogList";
import DashboardBlogList from "../pages/AdminDashboard/DashboardBlogList";
// import NotFound from "../pages/Componenets/NotFound";
import TestimonialAdminPanel from "../pages/AdminDashboard/TestimonialAdminPanel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    // errorElement: <NotFound></NotFound>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/faq",
        element: <FAQ></FAQ>,
      },
      {
        path: "/courses",
        element: <Courses></Courses>,
      },
      {
        path: "/courses/:slug",
        element: <CourseDetail></CourseDetail>,
      },
      {
        path: "/blogs",
        element: <Blogs></Blogs>,
      },
      {
        path: "/blogs/:slug",
        element: <BlogDetail></BlogDetail>,
      },
      {
        path: "/registration",
        element: <Registration></Registration>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile></Profile>
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/login",
        element: <AdminLogin />,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout></DashboardLayout>,
        children: [
          {
            index: true,
            element: <AdminDashboard></AdminDashboard>,
          },
          {
            path: "/dashboard/courseslist",
            element: <CoursesList></CoursesList>,
          },
          {
            path: "/dashboard/editcourse/:slug",
            element: <EditCourseForm></EditCourseForm>,
          },

          {
            path: "/dashboard/addcourse",
            element: <CourseForm></CourseForm>,
          },
          {
            path: "/dashboard/bloglist",
            element: <BlogList></BlogList>,
          },
          {
            path: "/dashboard/addblog",
            element: <EditBlogForm></EditBlogForm>,
          },

          {
            path: "/dashboard/editblog/:slug",
            element: <EditBlogForm isEdit></EditBlogForm>,
          },
          {
            path: "/dashboard/bloglist",
            element: <DashboardBlogList></DashboardBlogList>,
          },
          {
            path: "/dashboard/Testimonial",
            element: <TestimonialAdminPanel></TestimonialAdminPanel>,
          },
        ],
      },
    ],
  },
]);
