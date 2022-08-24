import './SearchBar.css';
import {FaAngleDown, FaAngleUp} from "react-icons/fa";
import { useState, useEffect } from 'react';
import DropDownInput from './DropDownInput';

const SearchBar = ({projectNumber, setProjectNumber, dropDownOptions, resetSearches}) => {
    const [droppedDown, setDroppedDown] = useState(false);
    const toggleDroppedDown = () => {
        setDroppedDown(!droppedDown);
    }

    const getAllProjects = () => {
        toggleDroppedDown();
        resetSearches();
    }

    return (
        <div className='Search-Bar-Window'>
            <div className="Search-Bar">
                <input
                    className='Search-Bar-Input'
                    type="text"
                    placeholder="Enter a project number..."
                    value = {projectNumber}
                    onChange={(e) => setProjectNumber(e.target.value)}
                />
                <div className='Search-Bar-Button' onClick={toggleDroppedDown}>
                    <FaAngleDown className='Search-Bar-Button-Symbol' />                    
                </div>
            </div>
            {droppedDown &&
            <>
                <div className='Search-Bar-Drop-Background' onClick={toggleDroppedDown}>
                </div>
                <div className='Search-Bar-Drop-Window'>
                    <div className='Drop-Down-Close-Button' onClick={toggleDroppedDown}>
                        <FaAngleUp  className='Search-Bar-Button-Symbol Close-Search-Button'/>
                    </div>
                    {dropDownOptions.map((Option, key) => (
                        <DropDownInput className='Drop-Down-Input' key={key}  {...Option}/>
                    ))}
                    <button className='Show-All-Button Drop-Down-Button' onClick={e => getAllProjects()}>Show All</button>
                </div>

            </>
            }
        </div>
    );
}

export default SearchBar;



