import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import { useDispatch, useSelector } from 'react-redux';
import { setEditorCode } from '../../store';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-ocean.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import ACTIONS from '../../Actions';
// features
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

// Language Modes
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/go/go';
import 'codemirror/mode/rust/rust';
import 'codemirror/mode/php/php';



const EditorComponent = ({ socketRef, roomId, onCodeChange }) => {

  const dispatch = useDispatch();

  const editorRef = useRef(null);

  const language = useSelector((state) => state.codeEditor.language);

  const isMountedRef = useRef(false);

  const dropDownChanged = useSelector((state)=> state.codeEditor.dropDownChanges);


  useEffect(() => {
    const init = () => {
      editorRef.current = Codemirror.fromTextArea(document.getElementById("realTimeEditor"), {
        mode: "text/x-csrc",
        theme: 'material-ocean',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        lineWrapping: true
      });

      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        dispatch(setEditorCode(code));
        onCodeChange(code);

        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code
          });
        }
      });
    }

    init();

  }, [])

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        // user join the room after the user have done some changes in the code.
        if (code !== null) {
          editorRef.current.setValue(code);
          editorRef.current.setOption('mode', language.langName)
        } 
        //user join the room and the other host hasn't changed the code yet
        else {
          editorRef.current.setValue(language.boilerPlate)
        }
      });
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);


  // if the dropdown changes update the editorview.
  useEffect(() => {

    // to change the boilerPlate code of the editor.
    if (isMountedRef.current) {

      editorRef.current.setValue(language.boilerPlate)
      //to change the language mode of the editor
      editorRef.current.setOption('mode', language.langName)
      
    }
    else {
      // Set the ref to true after the first render
      isMountedRef.current = true;
    }
  }, [dropDownChanged])

  return (
    <>
      <textarea id='realTimeEditor'></textarea>
    </>
  )
}

export default EditorComponent