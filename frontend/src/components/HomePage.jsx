import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import image from '../../images/image7.png';
import FeatureCard from './homePage/FeatureCard';
import { FiUsers, FiShare2, FiMessageCircle, FiBell } from 'react-icons/fi';
import logo from '../../images/logo.png';


gsap.registerPlugin(ScrollTrigger);

export const Header = () => {
    const navigate = useNavigate();

    useEffect(() => {
        
        gsap.to(".first-page-image", {
            y: -100, 
            opacity: 0.5, 
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ".first-page-image",
                start: "top top", 
                end: "bottom top", 
                scrub: true 
            }
        });

        // GSAP Scroll Animation for the feature cards
        gsap.utils.toArray(".feature-card").forEach((card) => {
            gsap.fromTo(card, {
                opacity: 0,
                y: 50 // Start from below
            }, {
                opacity: 1,
                y: 0, // End at original position
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%", 
                    toggleActions: "play none none none", 
                }
            });
        });
    }, []);

    return (
        <div className='bg-[#1F2135]'>
            {/* Navbar Section */}
            <nav className="flex justify-between items-center px-6 lg:px-32 py-5">
                <div className="text-lg font-bold flex">
                    <img src={logo} alt="Campus Chatter Logo" className='w-10 h-10 rounded-full mx-3' />
                    <span className='pt-1'>Campus Chatter</span>
                </div>
                <div className="hidden md:flex space-x-6">
                    <a href="/" className="hover:text-purple-500">Home</a>
                    <a href="/" className="hover:text-purple-500">About</a>
                    <a href="/" className="hover:text-purple-500">Features</a>
                    <a href="/" className="hover:text-purple-500">Contact</a>
                </div>
                <button className="bg-purple-500 text-white rounded-full px-4 py-2 font-bold hover:bg-purple-600" onClick={() => { navigate('/signup') }}>
                    Sign up
                </button>
            </nav>

            {/* Hero Section */}
            <div className="h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-32 space-y-10 lg:space-y-0 lg:space-x-10">
                {/* Text Section */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                        Grow your network, <br />
                        all are connected in{' '}
                        <span className="text-yellow-500 underline">Campus Chatter</span>
                    </h1>
                    <p className="mt-8 text-white">
                        Our platform offers a variety of features to help you stay connected, including instant messaging, video chat, and news feeds.
                    </p>
                    <button onClick={() => { navigate('/signup') }} className="mt-10 bg-orange-500 text-black py-3 px-6 rounded-full font-semibold hover:bg-orange-600">
                        Create Account
                    </button>
                </div>

                {/* Images Section */}
                <div className="w-full lg:w-1/2 ">
                    <img src={image} alt="hero" className='w-full first-page-image' />
                </div>
            </div>

            {/* Why Campus Chatter Section */}
            <section className="h-screen bg-[#E3E7EB] py-20 px-10 md:px-20 relative">
                <div className="flex flex-col md:flex-row items-center h-full">
                    {/* Left Grid Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full md:w-1/2 h-full">
                        
                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full feature-card">
                            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                {<FiUsers size={24} className="text-yellow-500" />}
                            </div>
                            <div className="flex-grow"></div> {/* Spacer to push content to bottom */}
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-black ">{"Engage In Community"}</h3>
                                <span className="text-blue-500 font-bold text-xl cursor-pointer">→</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full feature-card">
                            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                {<FiShare2 size={24} className="text-red-400" />}
                            </div>
                            <div className="flex-grow"></div> {/* Spacer to push content to bottom */}
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-black ">{"Discover New Connections"}</h3>
                                <span className="text-blue-500 font-bold text-xl cursor-pointer">→</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full feature-card">
                            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                {<FiMessageCircle size={24} className="text-purple-500"  />}
                            </div>
                            <div className="flex-grow"></div> {/* Spacer to push content to bottom */}
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-black ">{"Share Ideas And Creativity"}</h3>
                                <span className="text-blue-500 font-bold text-xl cursor-pointer">→</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full feature-card">
                            <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                {<FiBell size={24} className="text-blue-500" />}
                            </div>
                            <div className="flex-grow"></div> {/* Spacer to push content to bottom */}
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-black ">{"Access Information And News"}</h3>
                                <span className="text-blue-500 font-bold text-xl cursor-pointer">→</span>
                            </div>
                        </div>
                        
                        
                    </div>


                    <div className="md:pl-16 md:w-1/2 mt-10 md:mt-0 text-center md:text-left">
                        <h2 className="text-3xl md:text-6xl font-bold text-gray-800 mb-4">Why <br/><span className='underline'>Campus Chatter?</span></h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Campus Chatter can provide users with a wide range of benefits, from staying connected with loved ones to discovering new connections and engaging in creative expression and community building.
                        </p>
                        <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                            Learn more
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Header;
