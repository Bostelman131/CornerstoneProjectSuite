import './ConvertProject.css'
import { useState } from 'react';

const ConvertProject = ( { handleConvertClick, projectManagers, closeReassignWindow, checkProjectNumber, setErrorReport, convertCustomerNumber } ) => {
    const [ projectNumber, setProjectNumber ] = useState("");
    const [ projectType, setProjectType] = useState("");
    const [ projectOwner, setProjectOwner ] = useState("");

    const [ reassignMessage, setReassignMessage ] = useState("Please Wait... Loading...")
    const [ reassignLoading, setReassignLoading ] = useState(false);
    const [ reassignError, setReassignError ] = useState(false);
    const [ reassignSuccess, setReassignSuccess] = useState(false);

    const directions = "When archiving a project, it is typical to covert it to either a warranty or a maintenance project. This form below is used to create a new warranty or maintenance project related to the recently completed project. If there is no need to tranistion this project, just hit the cancel button below. Otherwise, enter the information into the form below to trigger the creation of a new project. Once all the fields have been entered and validated, click the submit button to be redirected back to the project overview you just left.";

    const css = []
    if(reassignError){
        css['--submitColor'] = 'red';
    }
    if(reassignSuccess){
        css['--submitColor'] = 'green';
    }
    if(!reassignError && !reassignSuccess){
        css['--submitColor'] = 'black';
    }

    const checkFields = () => {
        if(projectNumber.length == 7){
            if(projectType != ""){
                if(projectOwner != ""){
                    return true;
                }
                else{
                    setErrorReport("Please Select a Project Owner.", setReassignError, setReassignMessage, setReassignLoading);
                    return false;
                }
            }
            else{
                setErrorReport("Please Select a Project Type.", setReassignError, setReassignMessage, setReassignLoading);
                return false;
            }
        }
        else{
            setErrorReport("Invalid Project Number... Please enter a 7 digit project number.", setReassignError, setReassignMessage, setReassignLoading);
            return false;
        }
    }

    const handleSubmit = () => {
        setReassignLoading(true);

        if(checkFields()){
            checkProjectNumber( false, projectNumber, convertCustomerNumber, projectType, projectOwner, setReassignLoading, setReassignMessage, setReassignError, setReassignSuccess );
        }
    }

    return (
        <div style={css} className='PV-Reassign-Window'>

        <div className='PV-Reassign-Header PV-Inner-Header'>
            <label className='PV-Header-Title'>Convert Project to Warranty or Maintenance</label>
        </div>

        <div className='PV-Reassign-Primary'>
            <div className='PV-Reassign-Directions'>
                <label className='PV-Convert-Directions-Title'>General Directions</label>
                <p>{directions}</p>
            </div>
            

            <div className='PV-Reassign-Container'>
                <div className='PV-Reassign-Form'>
                    <input className='PV-Reassign-Input' maxLength={7} placeholder='Please Enter a Project Number...' onChange={e => {setProjectNumber(e.target.value)}}/>
                    <select id="PV-Reassign-Type" className='PV-Reassign-Input' onChange={ e => {setProjectType(e.target.value)}} >
                        <option value="">Project Type</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Warranty">Warranty</option>
                    </select>
                    <select id="PV-Reassign-Owner" className='PV-Reassign-Input' onChange={ e => {setProjectOwner(e.target.value)}} >
                        <option value="">Project Owner</option>
                        {
                            projectManagers.map((pmObject, key) => {
                                return(
                                    <option key={key} value={pmObject.id} onClick={e => setProjectOwner(pmObject)}>{pmObject.first_name + " " + pmObject.last_name}</option>
                                )
                            })
                        }
                    </select>

                    { reassignLoading &&
                        <label style={css} className='PV-Reassign-Message'>{reassignMessage}</label>
                    }
                    <div className='PV-Reassign-Button-Group'>
                        <button className='PV-Reassign-Button' onClick={e => closeReassignWindow()}>Cancel</button>
                        <button className='PV-Reassign-Button PV-Reassign-Submit' onClick={e => handleSubmit()}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default ConvertProject;