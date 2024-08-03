import logo from './logo.svg';
import './App.css';

import React from 'react';
import Header from './Components/Header';
import Discover from './Components/Discover';
import Services from './Components/Services';
import Explore from './Components/Explore';
import Testimonials from './Components/Testimonials';
import Footer from './Components/Footer';
import './styles.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Discover />
      <Services />
      <Explore />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
