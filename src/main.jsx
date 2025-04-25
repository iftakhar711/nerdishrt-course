import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./rouets/Rouets.jsx";
import { AuthProvider } from "./Context/AuthProvider.jsx";
import { lazy, Suspense } from "react";

const Profile = lazy(() => import("./pages/Registration/profile.jsx"));
const Login = lazy(() => import("./pages/Registration/Login.jsx"));
const Courses = lazy(() => import("./pages/Courses/Courses.jsx"));

createRoot(document.getElementById("root")).render(
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    }
  >
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </Suspense>
);
