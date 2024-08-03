import React from 'react';
import discoverImage from '../images/image1.jpg'; 

const Discover = () => {
  return (
    <section className="discover">
    <img src={discoverImage} alt="Students studying" />
    <div className="discover-text">
      <h2>Discover Honest Reviews</h2>
      <p>
        Welcome to our anonymous college review website where students can share their experiences and opinions on universities across the globe. Explore honest reviews, helpful insights, and a user-friendly dashboard to manage your own contributions. Join our community today and make informed decisions about your educational journey.
      </p>
    </div>
  </section>
  )
}




export default Discover;
