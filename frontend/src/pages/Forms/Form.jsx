import React, { useEffect, useState } from "react";
import "./Form.css";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar";
import {
  setEditorCode,
  setIsAuth,
  setLanguage,
  setLoading,
  setOutput,
} from "../../store";
import { useDispatch } from "react-redux";

const Form = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Set loading to true whenever user visit the form page.
  useEffect(() => {
    dispatch(setLoading(true));
  });

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const handleRoomId = (e) => {
    setRoomId(e.target.value);
  };

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("New Room created");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Room ID and Username is required");
      return;
    }
    if (roomId.length !== 36) {
      toast.error("Enter a Valid Room Id or Create a New Room");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    // To set state to default values when join the neww room
    localStorage.removeItem("editorCode");
    localStorage.removeItem("language");
    localStorage.removeItem("output");
    localStorage.setItem("isAuth", "true");
    dispatch(setIsAuth(true));
    dispatch(setEditorCode(""));
    dispatch(setOutput({ data: [], color: "white" }));
    dispatch(
      setLanguage({
        id: "cpp",
        langName: "text/x-csrc",
        name: "C++",
        fileName: "main.cpp",
        boilerPlate: `#include <iostream>

int main() {
                        
// Program code here
                        
std::cout << "Hello world!";
                        
return 0;
                        
}`,
      })
    );
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="formPageWrapper">
        <div className="formWrapper">
          <div className="formLogo">
            <img className="homePageLogo" src="./images/Logo.png" alt="logo" />
            <h3 className="logoName">CodeSphere</h3>
          </div>

          <div className="mainLabel">Paste Invitation ROOM ID</div>

          <div className="inputGroup">
            <input
              type="text"
              className="inputBox"
              placeholder="ROOM ID"
              value={roomId}
              onChange={handleRoomId}
              onKeyUp={handleInputEnter}
            />

            <input
              type="text"
              className="inputBox"
              placeholder="USERNAME"
              value={username}
              onChange={handleUsername}
              onKeyUp={handleInputEnter}
            />

            <button className="btn joinBtn" onClick={joinRoom}>
              Join
            </button>

            <span className="createInfo">
              If you Don't have an invite then create &nbsp;
              <span className="createBtn" onClick={createNewRoom}>
                new room
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
