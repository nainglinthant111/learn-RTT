import RootLayout from "@/pages/RootLayout";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import AboutAs from "@/pages/AboutAs";
import Error from "@/pages/Error";
import Blog from "@/pages/Blogs/Blog";
import BlogDetail from "@/pages/Blogs/BlogDetail";
import BlogRootLayout from "@/pages/Blogs/BlogRootLayout";
import ProductRootLayout from "@/pages/Products/ProductRootLayout";
import Product from "@/pages/Products/Product";
import ProductDetail from "@/pages/Products/ProductDetail";

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
        element: <BlogRootLayout />,
        children: [
          {
            index: true,
            element: <Blog />,
          },
          {
            path: ":postid",
            element: <BlogDetail />,
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
]);
