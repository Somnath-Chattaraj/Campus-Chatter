import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    console.log("here");
    if (location.pathname === '/') navigate("/homepage");
  }, [location]);
  return (
    <div>
   <nav className="flex bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link to="/">MyApp</Link>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link to="/homepage" className="text-gray-300 hover:text-white m-3">
            Home
          </Link>
          <Link to="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>
          <Link to="/posts" className="text-gray-300 hover:text-white">
            post
          </Link>
          <Link to="/room" className="text-gray-300 hover:text-white">
            room
          </Link>
        </div>
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white focus:outline-none">
            {/* Icon for mobile menu (e.g. hamburger icon) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
    <Outlet></Outlet>
    </div>
  );
};

export default Navbar;
