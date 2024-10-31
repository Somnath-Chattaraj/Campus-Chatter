import React, { useEffect, useState, useRef } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";

interface NavbarProps {
  btnName: string;
  navigateUrl: string;
  display: boolean;
  loadingUsr: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ btnName, navigateUrl, display, loadingUsr }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isSidebarOpen) {
      gsap.fromTo(sidebarRef.current, { x: -250, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 });
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (location.pathname === "/") navigate("/homepage");
  }, [location.pathname, navigate]);

  const closeSidebar = () => {
    gsap.to(sidebarRef.current, {
      x: -250,
      opacity: 0,
      duration: 0.3,
      onComplete: () => setIsSidebarOpen(false),
    });
  };

  return (
    <>
      <nav className="bg-[#1F2135] text-white px-6 lg:px-32 py-5 flex justify-between items-center">
        <div className="text-lg font-bold flex items-center w-1/3">
          <Link to="/homepage" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full mx-3" />
            <span className="pt-1">Campus Chatter</span>
          </Link>
        </div>

        <div className="hidden md:flex justify-center space-x-7 w-1/3 px-4">
          <Link to="/homepage" className="hover:text-purple-500">Home</Link>
          <Link to="/posts" className="hover:text-purple-500">Post</Link>
          <Link to="/edit" className="hover:text-purple-500">Edit</Link>
          <Link to="/room/joinroom" className="hover:text-purple-500">Room</Link>
          <Link to="/call" className="hover:text-purple-500 mx-2">Video Call</Link>
        </div>

        {display && (
          <div className="w-1/3 flex justify-end">
            {loadingUsr ? (
              <div className="hidden md:flex items-center bg-purple-500 text-white rounded-full px-4 py-2">
                <div className="w-4 h-4 border-4 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : (
              <button
                className="bg-purple-500 text-white rounded-full px-4 py-2 font-bold hover:bg-purple-600 hidden md:block"
                onClick={() => navigate(navigateUrl)}
              >
                {btnName || "Sign Up"}
              </button>
            )}
          </div>
        )}

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </nav>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={closeSidebar}>
          <div
            ref={sidebarRef}
            className="fixed top-0 left-0 w-64 h-full bg-[#1F2135] z-50 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="text-white mb-5 focus:outline-none" onClick={closeSidebar} aria-label="Close menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="space-y-4">
              <Link to="/homepage" className="block hover:text-purple-500" onClick={closeSidebar}>Home</Link>
              <Link to="/posts" className="block hover:text-purple-500" onClick={closeSidebar}>Post</Link>
              <Link to="/edit" className="block hover:text-purple-500" onClick={closeSidebar}>Edit</Link>
              <Link to="/room/joinroom" className="block hover:text-purple-500" onClick={closeSidebar}>Room</Link>
              <Link to="/call" className="block hover:text-purple-500" onClick={closeSidebar}>Video Call</Link>
              {display && (
                <button
                  className="bg-purple-500 text-white rounded-full px-4 py-2 font-bold hover:bg-purple-600"
                  onClick={() => {
                    closeSidebar();
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
