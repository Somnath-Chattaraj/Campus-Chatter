import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') navigate("/homepage");
  }, [location, navigate]);

  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">

          <div className="text-white text-2xl font-bold">
            <Link to="/">MyApp</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/homepage" className="text-gray-300 hover:text-white">
              Home
            </Link>

            <div className="relative">
              <select
                name="Register"
                className="bg-gray-700 text-gray-300 p-2 rounded-md outline-none"
                onChange={(e) => {
                  if (e.target.value === 'Login') navigate('/login');
                  else if (e.target.value === 'Register') navigate('/signup');
                }}
              >
                <option value="Login">Login</option>
                <option value="Register">Register</option>
              </select>
            </div>

            <Link to="/posts" className="text-gray-300 hover:text-white">
              Posts
            </Link>
            <Link to="/room" className="text-gray-300 hover:text-white">
              Room
            </Link>
          </div>

          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white focus:outline-none">
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
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default Navbar;
