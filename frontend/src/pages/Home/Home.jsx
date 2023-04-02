import React from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/Footer/Footer'
import { Navbar } from '../../components/Navbar/Navbar'
import { roomsOption } from '../../utils/roomsOption'
import "./Home.css"

const Home = () => {

  const navigate = useNavigate();

  const formNavigate = () => {
    navigate("/form")
  }

  return (
    <>
      <Navbar />
      <div className='homeWrapper'>
        <div className="homePageWrapper">
          <span className="mainheading">
            Share Code in Real-time with Developers
          </span>
          <span className="subheading">
            Welcome to Code Fusion, the ultimate platform for coding enthusiasts! Whether you're a beginner or an experienced programmer, Code Fusion offers a collaborative environment for you to work on your coding projects with fellow developers...
          </span>
          <div>
            <button className="btn joinBtn homePageBtn" onClick={formNavigate}>Share Code Now</button>
          </div>
          <span className="freeCode">Share code for free.</span>
        </div>

        <div className='homePageWrapper2'>
          {
            roomsOption.map((options) => (
              <div className='options' key={options.id}>
                <span className='optionsHeading'>{options.heading}</span>
                <span className='optionsSubHeading'>{options.subHeading}</span>
                <button className='optionsButton' onClick={formNavigate}>{options.button}</button>
              </div>
            ))
          }
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home