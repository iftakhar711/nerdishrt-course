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
import AdminLogin from "../pages/AdminDashboard/AdminLogin";
import AdminDashboaed from "../pages/AdminDashboard/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
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
        path: "/admin",
        element: <AdminLogin></AdminLogin>,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard></AdminDashboard>,
      },
    ],
  },
]);
