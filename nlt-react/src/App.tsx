import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Cart from "@/pages/Cart";
import NotForm from "@/pages/NotForm";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotForm />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
