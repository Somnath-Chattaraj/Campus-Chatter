import React, { useEffect } from "react";
import { gsap } from "gsap";

const NotFound = () => {
  useEffect(() => {
    // GSAP animation for the 404 text and additional elements
    const tl = gsap.timeline();

    // Animate the main title
    tl.fromTo(
      ".not-found-text",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "bounce.out" }
    )
      .fromTo(
        ".go-home",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3 } // Adjusted duration and delay
      )
      .fromTo(
        ".quirky-image",
        { scale: 0 },
        { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.3)", delay: 0.3 } // Adjusted duration and delay
      )
      .fromTo(
        ".fun-text",
        { rotation: -30, opacity: 0 },
        { rotation: 0, opacity: 1, duration: 1, stagger: 0.2, delay: 0.5 } // Adjusted delay
      );
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="not-found-text text-8xl font-bold">404</h1>
      <h2 className="not-found-text text-3xl mt-4">Page Not Found</h2>
      <p className="not-found-text text-lg mt-2">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Quirky animated image */}
      <img
        src="404.png" // Replace with your fun image URL
        alt="Quirky illustration"
        className="quirky-image w-32 h-32 mt-4"
      />

      <p className="fun-text text-md mt-4">
        It's just a 404 error, no big deal!
      </p>
      <a
        href="/"
        className="go-home mt-8 px-6 py-3 bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFound;
