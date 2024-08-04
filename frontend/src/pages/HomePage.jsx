import React from "react";
import Discover from "../components/Discover";
import Explore from "../components/Explore";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import "../styles.css";

const HomePage = () => {
  return (
    <div className="home-text">
      <Header />
      <Discover />
      <Services />
      <Explore />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
