import { lazy, Suspense } from "react";
import RootLayout from "@/pages/RootLayout";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import AboutAs from "@/pages/AboutAs";
import Error from "@/pages/Error";
// import Blog from "@/pages/Blogs/Blog";
// import BlogDetail from "@/pages/Blogs/BlogDetail";
// import BlogRootLayout from "@/pages/Blogs/BlogRootLayout";
const Blog = lazy(() => import("@/pages/Blogs/Blog"));
const BlogDetail = lazy(() => import("@/pages/Blogs/BlogDetail"));
const BlogRootLayout = lazy(() => import("@/pages/Blogs/BlogRootLayout"));

import ProductRootLayout from "@/pages/Products/ProductRootLayout";
import Product from "@/pages/Products/Product";
import ProductDetail from "@/pages/Products/ProductDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// eslint-disable-next-line react-refresh/only-export-components
const SuspenseFallback = () => <div>Loading...</div>;
export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <AboutAs />,
      },
      {
        path: "blogs",
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <BlogRootLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <Blog />
              </Suspense>
            ),
          },
          {
            path: ":postid",
            element: (
              <Suspense fallback={<SuspenseFallback />}>
                <BlogDetail />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "products",
        element: <ProductRootLayout />,
        children: [
          {
            index: true,
            element: <Product />,
          },
          {
            path: ":productId",
            element: <ProductDetail />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
