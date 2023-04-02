import "./Navbar.css"
import React, { useEffect, useState } from 'react'
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { sendCode } from '../../http';
import { setOpaque, setOutput, setProcessing, setStartAnimation } from '../../store';
import DropDown from '../DropDown/DropDown';
import MoreOption from '../Svg/MoreOption';
import RunButton from "../Svg/RunButton"
import ACTIONS from "../../Actions";

const Navbar = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/")
  }

  return (
    <div className='navbar'>
      <div className='navLogo' onClick={handleClick}>
        <img className='homePageLogo' src="/images/Logo.png" alt="logo" />
        <h3 className='logoName'>CodeSphere</h3>
      </div>

    </div>
  )
}

const NavbarEditor = ({ socketRef, roomId }) => {

  const dispatch = useDispatch();
  const editorCode = useSelector((state) => state.codeEditor.editorCode);
  const processing = useSelector((state) => state.codeEditor.processing);
  const language = useSelector((state) => state.codeEditor.language);
  const { screenSize } = useSelector((state) => state.codeEditor);


  // Sending the code to backend for compiling.
  const handleClick = async () => {

    // toast.error("Temporary Unavailable");

    // to clear the output box on the click if there is any text at the moment.
    dispatch(setOutput([]))
    
    // to stop other connected users from clickng on runbutton.  
    socketRef.current.emit(ACTIONS.RUN_TRIGGER,(roomId));
    let lines;
    dispatch(setProcessing(true));
    try {
      const response = await sendCode({ editorCode, language: language.id });
      if (response.data.error === '') {

        // to replace the /n from the output that we get and and convert the string into array of strings
        
        const str = response.data.output;
        // to store the output in the form of string of array.
        
        lines = str.split("\n")
        dispatch(setOutput({ data: lines, color: "#03ac13" }))
        toast.success("Code Compiled Successfully.")
      
      } else {
      
        toast.error("Compilation Error")
      
        const str = response.data.error;
        // to store the error in the form of string of array.
      
        lines = str.split("\n")
      
        dispatch(setOutput({ data: lines, color: "red" }))
        socketRef.current.emit(ACTIONS.SEND_OUTPUT,{roomId, response});
      }
    } catch (error) {
      toast.error("Failing to compiling the code at the moment")

      // for enabling the button for all the connected users.
      socketRef.current.emit(ACTIONS.ERROR_RUNNING,{roomId, message:"Failing to compiling the code at the moment"});
    };
    dispatch(setProcessing(false));

  }

  const handleToggle = () => {
    dispatch(setStartAnimation())
    dispatch(setOpaque())
  }

  return (
    <div className='navbar navEditor'>
      <div className='navLogo'>
        <img className='homePageLogo' src="/images/Logo.png" alt="logo" />
        <h3 className='logoEditor'>CodeSphere</h3>
      </div>

      <div className="navOptions">
        <button className={`btn ${processing ? 'waitBtn' : 'runBtn'}`} onClick={handleClick} disabled={processing}>
          <span style={{ paddingRight: "5px", fontWeight: "bold" }}>Run</span>
          <RunButton />
        </button >

        {screenSize > 600 && <div className="dropdown-container"><DropDown socketRef={socketRef} roomId={roomId}></DropDown></div>}

        <div className="toggle-btn" onClick={handleToggle}>
          <MoreOption />
        </div>

      </div>

    </div>
  )
}



export { Navbar, NavbarEditor }



