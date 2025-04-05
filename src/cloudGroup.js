import React from 'react';
// import './Clouds.css'; // Optional for animation/styling

// Declare constants outside OR inside the component
const cloudCount = 6;
const cloudURL = "https://tymtr.cdn.prismic.io/tymtr/8f4aa3ba-4d25-4195-bccd-a64c06f8c9ab_cloud1.svg";

const CloudGroup = () => {
  return (
    <div className="cloud-container">
      {Array.from({ length: cloudCount }).map((_, index) => (
        <img
          key={index}
          className="cloud"
          role="presentation"
          src={cloudURL}
          alt={`cloud-${index}`}
        />
      ))}
    </div>
  );
};

export default CloudGroup;