import React from "react";
import logo1 from "./image/welcomelego.jpg";
import Slideshow from "./slideshow";
import CloudGroup from './cloudGroup';

function Home() {
  return (
    <main style={{ padding: "20px", minHeight: "80vh" }}>
      <section className="welcomesection">
        <div className="welcome-container">
          <img src={logo1} alt="Welcome Logo" className="welcome-image" />
          <h1 className="title">Welcome to BuddyBot - Learning Made Magical!</h1>
        </div>
      </section>
      <section className='slideshowsection'>
        <div className='Slideshow'>
          <Slideshow />
          <CloudGroup />
        </div>
      </section>
    </main>
  );
}

export default Home;