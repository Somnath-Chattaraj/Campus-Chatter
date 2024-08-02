import React from 'react';
import serviceImage1 from '../images/image2.jpg';
import serviceImage2 from '../images/image3.jpg';
import serviceImage3 from '../images/image4.jpg';

const Services = () => (
  <section className="services">
    <h2>Our Services</h2>
    <div className="services-grid">
      <div className="service">
        <img src={serviceImage1} alt="Review Listings" />
        <h3>Review Listings</h3>
        <p>Anonymous college reviews. Free for all.</p>
      </div>
      <div className="service">
        <img src={serviceImage2} alt="User Dashboard" />
        <h3>User Dashboard</h3>
        <p>Personalized user experience. Accessible and intuitive.</p>
      </div>
      <div className="service">
        <img src={serviceImage3} alt="Review Submissions" />
        <h3>Review Submissions</h3>
        <p>Share your thoughts. Quick and easy.</p>
      </div>
    </div>
  </section>
);

export default Services;
