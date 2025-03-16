import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);
  return (
    <header className="bg-sky-600 p-4 text-white">
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">
          Fashion Shop
        </Link>
        <button className="block text-xl lg:hidden" onClick={toggleMenu}>
          &#8801;
        </button>
        <ul className="hidden gap-8 lg:flex">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "hover:text-gray-300"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "hover:text-gray-300"
              }
            >
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "hover:text-gray-300"
              }
            >
              Cart
            </NavLink>
          </li>
        </ul>
        <div
          className={`fixed inset-0 z-50 transform bg-sky-600 opacity-50 ${open ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden`}
        >
          <div className="flex h-full flex-col items-center justify-center gap-8">
            <Link to="/" className="text-3xl" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/shop" className="text-3xl" onClick={toggleMenu}>
              Shop
            </Link>
            <Link to="/cart" className="text-3xl" onClick={toggleMenu}>
              Cart
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
