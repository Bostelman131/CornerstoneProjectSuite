import './DropDownSelector.css'
import { useState } from 'react';
import {FaAngleDown, FaAngleUp} from "react-icons/fa";

const DropDownSelector = ({defaultValue, providedArray, setSelectionFunction}) => {
    const [ selectedId, setSelectedId ] = useState(defaultValue);
    const [ selectedPM, setSelectedPM ] = useState({});
    const [ droppedDown, setDroppedDown ] = useState(false);

    const toggleExtend = () => {
        setDroppedDown(!droppedDown)
    }

    providedArray.map((projectManager, key) => {
        if(projectManager.id == selectedId && selectedPM != projectManager){
            setSelectedPM(projectManager);
        }
    })

    const changePM = (newPMObject) => {
        setSelectionFunction(newPMObject.id);
        setSelectedPM(newPMObject);
        setSelectedId(newPMObject.id);
        toggleExtend();
    }


    if (droppedDown) {
        return (
            <div className='Drop_Down_Selector_Window'>
                {
                    providedArray.map((pmObject, key) => {
                        return(
                            <div className='Drop_Down_Input' key={key} onClick={e => {changePM(pmObject)}} >{pmObject.first_name + " " + pmObject.last_name}</div>
                        )
                    })
                }
            </div>
        )
    }

    else{
        return (
            <div className='Drop_Down_Selector_Window'>
                <div className='.Drop_Down_Selected Drop_Down_Input' onClick={e => {toggleExtend()}}>
                    {selectedPM.first_name + " " + selectedPM.last_name}
                </div>
            </div>
        )
    }



}

export default DropDownSelector;