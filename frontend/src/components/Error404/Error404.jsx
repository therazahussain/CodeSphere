import React from 'react'
import "./Error404.css"
import { Navbar } from '../Navbar/Navbar'
import { useNavigate } from 'react-router-dom'

const Error404 = () => {

  const navigate = useNavigate();

  return (
    <>
      <Navbar></Navbar>
      <div className="errorPage-container">
        <h1>Page Not Found</h1>
        <span className="error-subHeading">Double check the url or head back to <span className='homeLink' onClick={()=>{navigate("/")}}> Codeshare Home </span></span>
      </div>
    </>
  )
}

export default Error404