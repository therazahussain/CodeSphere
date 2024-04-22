import "./Editor.css"
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import ACTIONS from '../../Actions';
import EditorComponent from '../../components/Editor/EditorComponent';
import { NavbarEditor } from '../../components/Navbar/Navbar';
import { initSocket } from '../../socket';
import { useDispatch, useSelector } from "react-redux";
import { setDropDownChanged, setEditorCode, setLanguage, setLoading, setOutput, setProcessing } from '../../store';
import ToggleBox from '../../components/ToggleBox/ToggleBox';
import DotSvg from "../../components/Svg/DotSvg";
import Loading from "../../components/Loading/Loading";


const Editor = () => {

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate()
  const { roomId } = useParams();
  let lines;

  const output = useSelector((state) => state.codeEditor.output);
  const processing = useSelector((state) => state.codeEditor.processing);
  const editorCode = useSelector((state) => state.codeEditor.editorCode);
  const language = useSelector((state) => state.codeEditor.language);
  const loading = useSelector((state) => state.codeEditor.loading);
  const dispatch = useDispatch()
  const [clients, setClients] = useState([]);
  const prevEditorCodeRef = useRef('');


  useEffect(() => {

    // Get the stored values from local storage
    const storedEditorCode = localStorage.getItem('editorCode');
    const storedLanguage = localStorage.getItem('language');
    const storedOutput = localStorage.getItem('output');
  

    if (storedEditorCode) {
      dispatch(setEditorCode(storedEditorCode));
      codeRef.current = storedEditorCode;
      prevEditorCodeRef.current = storedEditorCode;
    }
    if (storedLanguage) {
      const getLanguage = JSON.parse(storedLanguage);
      dispatch(setLanguage(getLanguage));
    }
    if (storedOutput) {
      const getOutput = JSON.parse(storedOutput);
      dispatch(setOutput(getOutput));
    }
  }, []);

  // to store the data in the local storage when user refresh the page
  useEffect(() => {

    function handleUnload() {
      // Store the values in local storage only if they have changed
      if (editorCode !== prevEditorCodeRef.current) {
        localStorage.setItem('editorCode', editorCode);
        prevEditorCodeRef.current = editorCode;
      }
      localStorage.setItem('language', JSON.stringify(language));
      localStorage.setItem('output', JSON.stringify(output));
    }

    // Add the handleUnload function to the onbeforeunload event
    window.addEventListener('beforeunload', handleUnload);

    // Remove the handleUnload function from the onbeforeunload event when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    }
  }, [language, editorCode, output]);


  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/form');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          dispatch(setLoading(false))
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      // to replicate the dropdowndown changes 
      socketRef.current.on(ACTIONS.DROPDOWN_CHANGE, ({ language }) => {
        dispatch(setLanguage(language));
        dispatch(setDropDownChanged())
      })

      // to freeze the run button 
      socketRef.current.on(ACTIONS.FREEZE_CHANGE, () => {
        dispatch(setOutput([]))
        dispatch(setProcessing(true));
      })

      // to unfreeze connected users button
      socketRef.current.on(ACTIONS.UNFREEZE_USER, ({ message }) => {
        toast.error(message);
        dispatch(setProcessing(false));
      })

      // to show the output on the all connected user screen.
      socketRef.current.on(ACTIONS.SET_OUTPUT, ({ response }) => {
        if (response.data.error === '') {

          const str = response.data.output;

          lines = str.split("\n")
          dispatch(setOutput({ data: lines, color: "#03ac13" }))
          toast.success("Code Compiled Successfully.")

        } else {

          toast.error("Compilation Error")

          const str = response.data.error;

          lines = str.split("\n")

          dispatch(setOutput({ data: lines, color: "red" }))
        }
        dispatch(setProcessing(false));
      })

      // Listening for disconnected
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ socketId, username }) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          });
        }
      );


    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.FREEZE_CHANGE);
      socketRef.current.off(ACTIONS.UNFREEZE_USER);
      socketRef.current.off(ACTIONS.SET_OUTPUT);
      socketRef.current.off(ACTIONS.DROPDOWN_CHANGE);
      socketRef.current.disconnect();
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />
  }

  return (
    <>
      {
        loading
          ?
          <Loading />
          :
          <>
            <NavbarEditor socketRef={socketRef} roomId={roomId}></NavbarEditor>
            <div className="mainWrap">

              {/* Code Editor Display*/}
              <div className="editorWrap">
                <div className='fileNameDiv'>
                  <span className='fileName'>
                    <DotSvg />
                    {language.fileName}
                  </span>
                </div>
                <EditorComponent socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
                  codeRef.current = code;
                }} />

              </div>


              {/* Output Display */}
              <div>
                <div className='fileNameDiv'>
                  <span className='fileName'>
                    <DotSvg />
                    Output
                  </span>
                </div>
                <div className={`outputPage scroll ${processing && 'output-compiling compiling-text'}`}>

                  {/* Output when updated */}
                  {output.data !== undefined && output.data.map((line, i) => (
                    <div key={i} style={{ display: 'flex' }}>
                      <span style={{ display: "inline", color: "#464B5D" }}>
                        {i + 1}
                      </span>
                      <span style={{ paddingLeft: "0.7em", display: "inline", color: output.color }}>
                        {line}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Editor page Footer */}
                <div className="editorFooter">
                  <span>Created By  <a href="https://github.com/therazahussain" target="_blank">@Raza Husain Rizwi</a></span>
                </div>
              </div>
            </div>
            <ToggleBox clients={clients} socketRef={socketRef} roomId={roomId}></ToggleBox>
          </>
      }
    </>
  )
}

export default Editor