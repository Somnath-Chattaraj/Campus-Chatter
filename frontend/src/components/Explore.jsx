import React from 'react';
import exploreImage from '../images/image5.jpg';

const Explore = () => {
  return (
    <section className="explore">
    
    <div>
    <h2>Anonymous College Reviews</h2>
    <button className="btn-secondary">Explore anonymously</button>
    <button className="btn-secondary">Share your college experiences</button>
    <button className="btn-secondary">User-friendly dashboard</button>
    </div>
    <img src={exploreImage} alt="College building" />
    
  </section>
  )
}



export default Explore;
