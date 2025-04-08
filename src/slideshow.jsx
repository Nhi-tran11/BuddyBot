import React, {useEffect, useState} from "react";

import img1 from './image/slideshow1.jpg';
import img2 from './image/slideshow2.jpg';
import img3 from './image/slideshow3.jpg';

const images = [
  { src: img1, 
    caption: 'Welcome to BuddyBot',
    paragraph:'BuddyBot is an AI-powered learning tool designed especially for kids. It creates personalized assignments and makes studying fun and interactive!', },
  { src: img2, 
    caption: 'Learn with fun',
    paragraph: 'Our platform offers daily plans, quizzes, and games to keep young minds engaged. Everything is built with child-friendly design and safety in mind.',
   },
  { src: img3, 
    caption: 'Grow Smarter Every Day',
    paragraph:'With BuddyBot, kids can explore lessons at their own pace, with guidance from smart AI that adapts to their strengths and learning needs.',},
];

const Slideshow = () => {
    const [slideIndex, setSlideIndex] = useState(0);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
  
      return () => clearTimeout(timer);
    }, [slideIndex]);
    return (
        <div>
          <h2 className="titleslide">About us</h2>
          
          <div className="slideshow-container">
            {images.map((image, index) => (
            <div
                className={`mySlides fade ${index === slideIndex ? 'active-slide' : ''}`}
                style={{ display: index === slideIndex ? 'block' : 'none' }}
                key={index}
              >
                <div className="numbertext">{index + 1} / {images.length}</div>
                <img src={image.src} style={{ width: '100%' }} alt={`Slide ${index + 1}`} />
                <div className="text">
                    <h3>{image.caption}</h3>
                    <p className="paragraph">{image.paragraph}</p>
                </div>
               
              </div>
            ))}
          </div>
    
          <br />
    
          <div style={{ textAlign: 'center' }}>
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${idx === slideIndex ? 'active' : ''}`}
              ></span>
            ))}
          </div>
        </div>
      );
    };
    
    export default Slideshow;
