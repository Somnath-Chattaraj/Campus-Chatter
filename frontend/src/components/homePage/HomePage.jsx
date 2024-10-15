import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Helmet } from "react-helmet-async"; 
import image from "../../images/image7.png";
import { FiUsers, FiShare2, FiMessageCircle, FiBell } from "react-icons/fi";
import "../../index.css";
import { useUser } from "../../hook/useUser";
import Navbar from "../MainNavbar";

gsap.registerPlugin(ScrollTrigger);

export const Header = () => {
  const navigate = useNavigate();
  const { loadingUser, userDetails } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.to(".first-page-image", {
      y: -100,
      opacity: 0.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".first-page-image",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.utils.toArray(".feature-card").forEach((card) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }, [loadingUser]);

  return (
    <div className="bg-[#1F2135]">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Capusify",
            url: "https://capusify.site",
            logo: "https://capusify.site/logo.png",
            description: "Your platform for XYZ.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-800-123-456",
              contactType: "Customer Support",
            },
          })}
        </script>
        <meta property="og:title" content="Capusify - Your Platform for XYZ" />
        <meta property="og:description" content="Offering the best services in XYZ." />
        <meta property="og:image" content="https://capusify.site/og-image.jpg" />
        <meta property="og:url" content="https://capusify.site" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Capusify - Your Platform for XYZ" />
        <meta name="twitter:description" content="Offering the best services in XYZ." />
        <meta name="twitter:image" content="https://capusify.site/og-image.jpg" />
      </Helmet>
      {loadingUser && <Navbar display={true} loadingUsr={true} />} 
      {!loadingUser && !userDetails && <Navbar display={true} loadingUsr={false} btnName="Login" navigateUrl="/login" />}
      {!loadingUser && userDetails && <Navbar display={true} loadingUsr={false} btnName="Logout" navigateUrl="/logout" />}
      
      <div className="h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-32 space-y-10 lg:space-y-0 lg:space-x-10">
  <div className="w-full lg:w-1/2 text-center lg:text-left">
    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
      Grow your network, <br />
      all are connected in{" "}
      <span className="text-yellow-500 underline">Campus Chatter</span>
    </h1>
    <p className="mt-8 text-white">
      Our platform offers a variety of features to help you stay connected, including instant messaging, video chat, and news feeds.
    </p>
    
    {loadingUser ? (
      <div className="flex justify-center mt-10 lg:justify-start">
        <div className="flex bg-orange-500 text-white py-3 px-6 rounded-full">
          <div className="w-4 h-4 border-4 border-t-transparent mt-1 border-white rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      </div>
    ) : (
      <>
        {!userDetails && (
          <button
            onClick={() => {
              navigate("/signup");
            }}
            className="mt-10 bg-orange-500 text-black py-3 px-6 rounded-full font-semibold hover:bg-orange-600"
          >
            Create Account
          </button>
        )}
        {userDetails && (
          <div className="flex justify-center lg:justify-start mt-10">
            <button
              onClick={() => {
                navigate("/posts");
              }}
              className="bg-orange-500 text-black py-3 px-6 rounded-full font-semibold hover:bg-orange-600"
            >
              Get Started
            </button>
          </div>
        )}
      </>
    )}
  </div>
        <div className="w-full lg:w-1/2 ">
          <img src={image} alt="hero" className="w-full first-page-image" />
        </div>
      </div>

      <section className="h-full md:h-screen bg-[#E3E7EB] py-20 px-10 md:px-20 relative">
        <div className="flex flex-col md:flex-row items-center h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full md:w-1/2 h-full">
            {/* Feature Cards */}
            {["Engage In Community", "Discover New Connections", "Share Ideas And Creativity", "Access Information And News"].map((title, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full feature-card">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  {index === 0 && <FiUsers size={24} className="text-yellow-500" />}
                  {index === 1 && <FiShare2 size={24} className="text-red-400" />}
                  {index === 2 && <FiMessageCircle size={24} className="text-purple-500" />}
                  {index === 3 && <FiBell size={24} className="text-blue-500" />}
                </div>
                <div className="flex-grow"></div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-black">{title}</h3>
                  <span className="text-blue-500 font-bold text-xl cursor-pointer">→</span>
                </div>
              </div>
            ))}
          </div>
          <div className="md:pl-16 md:w-1/2 mt-10 md:mt-0 text-center md:text-left">
            <h2 className="text-3xl md:text-6xl font-bold text-gray-800 mb-4">Why <br/><span className='underline'>Campus Chatter?</span></h2>
            <p className="text-lg text-gray-600 mb-8">
              Campus Chatter can provide users with a wide range of benefits, from staying connected with loved ones to discovering new connections and engaging in creative expression and community building.
            </p>
            <Link to="https://medium.com/@somnathchattaraj5/campus-chatter-a-space-for-students-to-share-chat-connect-anonymously-98cb43171148">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            
            >
              Learn more
            </button>
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Header;
