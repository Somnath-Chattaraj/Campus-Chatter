import React from 'react';

const FeatureCard = ({ icon, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full">
      <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
        {icon}
      </div>
      <div className="flex-grow"></div> {/* Spacer to push content to bottom */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-black ">{title}</h3>
        <span className="text-blue-500 font-bold text-xl cursor-pointer">→</span>
      </div>
    </div>
  );
};

export default FeatureCard;
