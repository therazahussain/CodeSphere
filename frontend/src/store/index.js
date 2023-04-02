import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: localStorage.getItem('isAuth') === 'true' || false,
  output: {data:[], color:"white"},
  editorCode: "Hello from white house",
  startAnimation:false,
  screenSize:window.innerWidth,
  opaque:false,
  processing:false,
  dropDownChanges: 1,
  loading:true,
  language:{
    id:"cpp",
    name:"C++",
    langName:"text/x-csrc",
    fileName:"main.cpp",
    boilerPlate: `#include <iostream>

int main() {
            
    // Program code here
            
    std::cout << "Hello world!";
            
    return 0;
            
}` 
  },
};

export const codeSlice = createSlice({
  name: "codeEditor",
  initialState,
  reducers: {
    setIsAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setOutput: (state,action) => {
      state.output = action.payload; 
    },
    setEditorCode: (state,action) => {
      state.editorCode = action.payload; 
    },
    setLanguage: (state,action) => {
      state.language = action.payload; 
    },
    setStartAnimation: (state) => {
      state.startAnimation = !state.startAnimation; 
    },
    setOpaque: (state) => {
      state.opaque = !state.opaque; 
    },
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    setProcessing: (state, action) => {
      state.processing = action.payload;
    },
    setDropDownChanged: (state) => {
      state.dropDownChanges += 1 ;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setOutput, setEditorCode, setLanguage, setStartAnimation, setOpaque, setScreenSize, setProcessing, setDropDownChanged, setLoading, setIsAuth } =
  codeSlice.actions;
export default codeSlice.reducer;