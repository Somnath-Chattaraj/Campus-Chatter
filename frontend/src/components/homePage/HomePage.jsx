import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Helmet } from "react-helmet-async"; // Add this line
import image from "../../images/image7.png";
import { FiUsers, FiShare2, FiMessageCircle, FiBell } from "react-icons/fi";
import logo from "../../images/logo.png";
import "../../index.css";
import { useUser } from "../../hook/useUser";
import { InfinitySpin } from "react-loader-spinner";

gsap.registerPlugin(ScrollTrigger);

export const Header = () => {
  const navigate = useNavigate();
  const { loadingUser, userDetails } = useUser();

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

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <InfinitySpin color="#6366F1" />
      </div>
    );
  }

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
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Capusify - Your Platform for XYZ" />
        <meta
          property="og:description"
          content="Offering the best services in XYZ."
        />
        <meta
          property="og:image"
          content="https://capusify.site/og-image.jpg"
        />
        <meta property="og:url" content="https://capusify.site" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Capusify - Your Platform for XYZ" />
        <meta
          name="twitter:description"
          content="Offering the best services in XYZ."
        />
        <meta
          name="twitter:image"
          content="https://capusify.site/og-image.jpg"
        />
      </Helmet>

      <nav className="flex justify-between items-center px-6 lg:px-32 py-5">
        <div className="text-lg font-bold flex">
          <img
            src={logo}
            alt="Campus Chatter Logo"
            className="w-10 h-10 rounded-full mx-3"
          />
          <span className="pt-1">Campus Chatter</span>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link to="/homepage" className="hover:text-purple-500 ">
            Home
          </Link>
          <Link to="/posts" className="hover:text-purple-500 ">
            Post
          </Link>
          <Link to="/room/joinroom" className="hover:text-purple-500">
            Room
          </Link>
          <Link to="/" className="hover:text-purple-500">
            Contact
          </Link>
        </div>
        {!userDetails && (
          <button
            className="bg-purple-500 text-white rounded-full px-4 py-2 font-bold hover:bg-purple-600"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign up
          </button>
        )}
        {userDetails && (
          <button
            className="bg-purple-500 text-white rounded-full px-4 py-2 font-bold hover:bg-purple-600"
            onClick={() => {
              navigate("/logout");
            }}
          >
            Logout
          </button>
        )}
      </nav>

      <div className="h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-32 space-y-10 lg:space-y-0 lg:space-x-10">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
            Grow your network, <br />
            all are connected in{" "}
            <span className="text-yellow-500 underline">Campus Chatter</span>
          </h1>
          <p className="mt-8 text-white">
            Our platform offers a variety of features to help you stay
            connected, including instant messaging, video chat, and news feeds.
          </p>
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
            <button
              onClick={() => {
                navigate("/posts");
              }}
              className="mt-10 bg-orange-500 text-black py-3 px-6 rounded-full font-semibold hover:bg-orange-600"
            >
              Get Started
            </button>
          )}
        </div>
        <div className="w-full lg:w-1/2 ">
          <img src={image} alt="hero" className="w-full first-page-image" />
        </div>
      </div>

      {/* Rest of your component remains unchanged */}
    </div>
  );
};

export default Header;
