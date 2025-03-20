import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import { Outlet } from "react-router-dom";
function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mt-16 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
