import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface NavbarProps {
  btnName: string;
  navigateUrl: string;
  display: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ btnName, navigateUrl, display }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") navigate("/homepage");
  }, [location, navigate]);

  return (
    <>
      <nav className="bg-[#1F2135] text-white px-6 lg:px-32 py-5 flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-lg font-bold flex items-center">
          <img
            src={"/logo.png"}
            alt="Logo"
            className="w-10 h-10 rounded-full mx-3"
          />
          <span className="pt-1">Campus Chatter</span>
        </div>

        {/* Navigation Links (Centered) */}
        <div className="hidden md:flex flex-grow justify-center space-x-6">
          <Link to="/homepage" className="hover:text-purple-500 ">
            Home
          </Link>
          <Link to="/posts" className="hover:text-purple-500 ">
            Post
          </Link>
          <Link to="/edit" className="hover:text-purple-500 ">
            Edit
          </Link>
          <Link to="/room/joinroom" className="hover:text-purple-500">
            Room
          </Link>
          <Link to="/" className="hover:text-purple-500">
            contact
          </Link>
        </div>

        {/* Button Section */}
        {display && (
          <button
            className="bg-purple-500 text-white rounded-full px-4 py-2 font-bold hover:bg-purple-600 hidden md:block"
            onClick={() => navigate(navigateUrl)}
          >
            {btnName || "Sign Up"}
          </button>
        )}

        {/* Hamburger Menu for Small Screens */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </nav>

      {/* Sidebar for Small Screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed top-0 left-0 w-64 h-full bg-[#1F2135] z-50 p-5">
            <button
              className="text-white mb-5 focus:outline-none"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </button>
            <nav className="space-y-4">
              <Link
                to="/homepage"
                className="block hover:text-purple-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block hover:text-purple-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                About
              </Link>
              <Link
                to="/features"
                className="block hover:text-purple-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/contact"
                className="block hover:text-purple-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                Contact
              </Link>
              {display && (
                <button
                  className="bg-purple-500 text-white rounded-full px-4 py-2 font-bold hover:bg-purple-600"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate(navigateUrl);
                  }}
                >
                  {btnName || "Sign Up"}
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
};

export default Navbar;
