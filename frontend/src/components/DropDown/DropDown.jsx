import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { languageOptions } from '../../utils/languageOptions';
import { setDropDownChanged, setLanguage } from '../../store';
import "./DropDown.css"
import DropDownArrow from '../Svg/DropDownArrow';
import ACTIONS from '../../Actions';

const DropDown = ({socketRef, roomId}) => {

    const [isActivate, setIsActivate] = useState(false)
    const language = useSelector((state)=> state.codeEditor.language); 

    const dispatch = useDispatch();

    const handleClick = (language) => {
        dispatch(setDropDownChanged());
        dispatch(setLanguage({
            id: language.id, langName: language.langName, name: language.name, fileName: language.fileName, boilerPlate: language.boilerPlate
        }));
        socketRef.current.emit(ACTIONS.SYNC_DROPDOWN,{language, roomId});
        setIsActivate(!isActivate)
    }

    return (

        <div className="dropdown">
            <div className="dropdown-btn" onClick={() => { setIsActivate(!isActivate) }}>
                <span>{language.name}</span>
                <span><DropDownArrow/></span></div>

            {
                isActivate &&
                <div className="dropdown-content" id="scroll">

                    {
                        languageOptions.map((language) => (
                            <div className="dropdown-item" key={language.id} value="raza1" onClick={() => { handleClick(language) }}>
                                {language.name}
                            </div>
                        ))
                    }

                </div>
            }
        </div>

    )
}

export default DropDown