import RootLayout from "@/pages/RootLayout";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import AboutAs from "@/pages/AboutAs";
import Error from "@/pages/Error";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import BlogRootLayout from "./pages/BlogRootLayout";

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
        ],
    },
]);
