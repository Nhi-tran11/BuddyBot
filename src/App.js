import logo from './logo.svg';
import './App.css';
import './Slideshow.css';

import React from "react";
import Header from "./header";
import Footer from "./footer";
import logo1 from "./image/welcomelego.jpg";
import Slideshow from "./slideshow";
import CloudGroup from './cloudGroup';

function App() {
  return (

    <div>
      <Header />
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
            <CloudGroup/>
          </div>
        </section>



      </main>

      <Footer />
    </div>
  );
}

export default App;
