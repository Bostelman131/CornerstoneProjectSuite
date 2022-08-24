import './ProjectSalesToggle.css';

const ProjectSalesToggle = ( {toggleSelection, setToggleSelection} ) => {
    /*
    Projects - Shows only Projects
    Sales - Shows only Sales
    */
    const handleToggleClick = (text) => {
        setToggleSelection(text);
    };


    return (
        <div className='App-Header-Toggle-Container'>
            {
            toggleSelection === 'Projects' ?
                <div className='App-Header-Toggle AHT-Selected'>  
                    <div className='AHT-Text'>
                        Projects
                    </div>
                </div>
            :
                <div className='App-Header-Toggle AHT-Unselected' onClick={event => {handleToggleClick("Projects")}}>  
                    <div className='AHT-Text'>
                        Projects
                    </div>
                </div>
            }
            {
            toggleSelection === 'Sales' ?
                <div className='App-Header-Toggle AHT-Selected'>  
                    <div className='AHT-Text'>
                        Sales
                    </div>
                </div>
            :
                <div className='App-Header-Toggle AHT-Unselected' onClick={event => {handleToggleClick("Sales")}}>  
                    <div className='AHT-Text'>
                    Sales
                    </div>
                </div>
            }

        </div>
    )
  };
  
  export default ProjectSalesToggle;