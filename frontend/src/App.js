import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Toaster } from 'react-hot-toast';
import Editor from './pages/Editor/Editor';
import Form from './pages/Forms/Form';
import Home from "./pages/Home/Home.jsx";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setScreenSize } from './store';
import Error404 from './components/Error404/Error404';

function App() {

  const isAuth = useSelector((state) => state.codeEditor.isAuth);

  const dispatch = useDispatch();

  // to check the screen size.
  useEffect(() => {
    const handleResize = () => {
      dispatch(setScreenSize(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div>
        <Toaster position='top-center'
        />
      </div>
      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/form" element={<Form />} />

          <Route path="/editor/:roomId" element={isAuth ? <Editor /> : <Error404 />} />

          <Route path="/*" element={<Error404 />} />

        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
