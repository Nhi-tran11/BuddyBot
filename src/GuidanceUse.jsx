
import './GuidanceUse.css';
import React, { useState } from 'react';
// import { C } from "vitest/dist/chunks/reporters.d.CfRkRKN2.js";


import img1 from './image/GuidanceUse1.jpg';
import img2 from './image/GuidanceUse2.jpg';
import img3 from './image/GuidanceUse3.jpg';
import img4 from './image/GuidanceUse4.jpg';
import img5 from './image/GuidanceUse5.jpg';
const images = [
    {
        src: img1,
        caption: 'Go to the Home Page',
        paragraph: 'Here, you will see a welcome message and a slideshow showing all the cool things BuddyBot can do.\n Scroll through to learn more!',
    },
    {
        src: img2,
        caption: 'Start Learning',
        paragraph: 'Click on "Lesson" to:\n - Watch videos and read fun stories\n - Practice with interactive activitiess\n - Learn at your own pace – no rush!.'
    },
    {
        src: img3,
        caption: 'Play Games',
        paragraph: 'After learning, it’s time for fun! Just click on "Game" to:\n - Play educational gamess\n - Solve puzzles and challengess\n'
    },
    {
        src: img4,
        caption: 'Practice makes perfect',
        paragraph: '- As a parent you can create some assignments for kids using AI to generate your questions.\n - As the kid you can see the tasks which are assigned for you when you click on the Assignment buttons.\n '
    },
    {
        src: img5,
        caption: 'Timetable, Sign Up and Sign In',
        paragraph: '- As a parent you can create timetable for your kids very easily. Just click on Timetable on Navigation Bar.\n - If you are a new user, click on Sign Up to create an account.\n - If you already have an account, click on Sign In to log in.\n - If you forget your password, click on "Forgot Password?" to reset it.'
    },
];

const GuidanceUse = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const nextSlide = () => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setSlideIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };


    return (
        <div>
            <h2 className="titleslide">How to Use BuddyBot - Your Smart Learning Buddy! </h2>

            <div className="slideshow-container">
                {images.map((image, index) => (
                    <div
                        className={`mySlides fade ${index === slideIndex ? 'active-slide' : ''}`}
                        style={{ display: index === slideIndex ? 'block' : 'none' }}
                        key={index} >
                        <div className="numbertext">{index + 1} / {images.length}</div>
                        <img src={image.src} style={{ width: '100%' }} alt={`Slide ${index + 1}`} />
                        <div className="text">
                            <h3>{image.caption}</h3>
                            <p className="paragraph">{image.paragraph}</p>
                        </div>

                    </div>


                ))}
                <div className="prev" onClick={prevSlide}>❮</div>
                <div className="next" onClick={nextSlide}>❯</div>

            </div>

            <br />

        </div>
    );
};

export default GuidanceUse;
