import "./ToggleBox.css";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorCode, setIsAuth, setLanguage, setOpaque, setOutput, setStartAnimation } from '../../store';
import Clients from '../Client/Clients';
import DropDown from '../DropDown/DropDown';

const ToggleBox = ({ clients, roomId, socketRef }) => {

    const code = useSelector((state) => state.codeEditor.editorCode);
    const { screenSize } = useSelector((state) => state.codeEditor);
    const startAnimation = useSelector((state) => state.codeEditor.startAnimation);
    const opaque = useSelector((state) => state.codeEditor.opaque);
    const navigate = useNavigate()

    const dispatch = useDispatch();

    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // To copy the room id
    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('The Room Id has been copied.');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }


    // To download the file in the  editor
    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "CodeFusion-Code.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        toast.success("Code text file downloaded successfully")
    }

    // To close the toggle Box
    const handleClose = () => {
        setTimeout(() => {
            dispatch(setOpaque())
        }, 600);
        dispatch(setStartAnimation())
    }

    const handleLeave = () => {
        localStorage.removeItem('editorCode')
        localStorage.removeItem('language')
        localStorage.removeItem('output')
        dispatch(setIsAuth(false));
        dispatch(setEditorCode(''))
        navigate("/");
        handleClose();
        dispatch(setOutput({ data: [], color: "white" }));
        dispatch(setLanguage({
            id: "cpp", langName: "text/x-csrc", name: "C++", fileName: "main.cpp", boilerPlate: `#include <iostream>

int main() {
                        
// Program code here
                        
std::cout << "Hello world!";
                        
return 0;
                        
}`
        }));
    }

    const toggleStyle = startAnimation ? { top: "0px" } : {};

    return (
        <>
            <div className='toggle-box' style={toggleStyle}>
                <div className="toggle-container">

                    <div className="toggle-options">
                        <div className='navLogo'>
                            <img className='homePageLogo' src="/images/Logo.png" alt="logo" />
                            <h3 className='logoEditor'>CodeFusion</h3>
                            <button className='closeBtn' onClick={handleClose}>X</button>
                        </div>
                        {screenSize <= 600 && <div className="dropDown-btn toggle-dropdown"><DropDown socketRef={socketRef} roomId={roomId}></DropDown></div>}
                        <div className='heading-box toggleBtn' onClick={toggleDropdown}><span className="inside-text">
                            CONNECTED USERS</span></div>
                        {showDropdown && <div className="clientList scroll">

                            {
                                clients.map((client, id) =>
                                    (<Clients key={id} username={client.username} />)
                                )
                            }

                        </div>}

                        <div className="toggleBtn" onClick={downloadTxtFile}><span className="inside-text">
                            DOWNLOAD CODE</span></div>
                        <div className="toggleBtn" onClick={copyRoomId}><span className="inside-text">
                            COPY ROOM ID</span></div>
                        <div className="toggleBtn" onClick={handleLeave}><span className="inside-text">
                            LEAVE ROOM</span></div>


                    </div>

                </div>
            </div>

            {opaque && <div className="overlay" onClick={handleClose}></div>}
        </>
    )
}

export default ToggleBox