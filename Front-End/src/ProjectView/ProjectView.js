import './ProjectView.css';
import { useEffect, useState } from 'react';
import UserPanel from '../UserPanel/UserPanel';
import EditTag from '../EditTag/EditTag'
import DropDownSelector from '../DropDownSelector/DropDownSelector';
import ConvertProject from './ConvertProject'

const ProjectView = ({ activeUser, fontSize, textHeight, projectViewProject, projectViewSale, setProjectView, projectLinks, 
    salesLinks, pvProjectNumber, pvSalesNumber, handlePVSubmit, getProjectManagers, getSalesmen, handleProjectClick, 
    projectOrSale, getAssignedProjects, projectManager, handleCPSubmit, isProjectNumberUnique, apiToken}) => {

    const generalDirections = "In order to convert a sales opportunity to a project, an updated booking sheet will need to be sent to accounting. The booking sheet from sales to modify is found at the 'Booking Sheet' link above, under 'Project Links'. If for some reason this link is not shown, please contact the responsible party displayed in the header. Once accounting responds with a project number and customer number, fill them in below along with the project type. Once all fields have been entered and validated, click on the submit button. This will trigger the folder structure to be created and the newly created project folder to be opened automatically. If for any reason this form doesn't work as intended, please contact your system administrator.";

    const primaryFontSize = 24;
    const secondaryFontSize = 19;

    const primaryFontWeight = 800;
    const secondaryFontWeight = 600;

    const [ projectOrNot, setProjectOrNot ] = useState(false);
    const [ converted, setConverted ] = useState(false);
    const [ assignedProjects, setAssignedProjects ] = useState([]);

    const [ editable, setEditable ] = useState('false');
    const [ buttonText, setbuttonText ] = useState("Edit");

    const [ owner, setOwner ] = useState(false);

    const [ linkList, setLinkList ] = useState( ["",""] );
    const [ originalProjectNumber, setOriginalProjectNumber] = useState(projectViewProject['projectNumber'])


    const [ loading, setPVLoading ] = useState(false);
    const [ submitMessage, setPVSubmitMessage ] = useState("Please Wait... Loading...")
    const [ submitError, setPVError ] = useState(false); 
    const [ submitSuccess, setPVSuccess ] = useState(false);
    const [ projectManagers, setProjectManagers ] = useState( ["",""] );
    const [ selectedProjectManager, setSelectedProjectManager ] = useState("");


    const [  convertProjectNumber, setConvertProjectNumber ] = useState("");
    const [  convertCustomerNumber, setConvertCustomerNumber ] = useState("");
    const [  convertProjectType, setConvertProjectType ] = useState("");

    const [ cpLoading, setCPLoading ] = useState(false);
    const [ cpSubmitMessage, setCPSubmitMessage ] = useState("Please Wait... Loading...");
    const [ cpSubmitError, setCPSubmitError ] = useState(false); 
    const [ cpSubmitSuccess, setCPSubmitSuccess ] = useState(false);

    const [ projectType, setProjectType ] = useState("Project")
    const [ archived, setArchived ] = useState(false);
    const [ newlyArchived, setNewlyArchived ] = useState(false);

    const [ saleSubmitted, setSaleSubmitted ] = useState(false);

    if(saleSubmitted === false && projectViewSale.submitted === true){
        setSaleSubmitted(true);
    }
    if(saleSubmitted === true && projectViewSale.submitted === false){
        setSaleSubmitted(false);
    }


    if(activeUser.is_admin == true && owner != true){
        setOwner(true);
    }

    let projectOwner = {}
    let salesOwner = {}

    if(projectOrSale == 'project'){
        if(projectOrNot == false){
            setProjectOrNot(true);
        }

        if(pvProjectNumber != undefined && originalProjectNumber != pvProjectNumber){
            setOriginalProjectNumber(pvProjectNumber);
        }
    
        if(activeUser.id == projectViewProject['owner_id'] && owner != true){
            setOwner(true);
        }
    
        if(projectLinks != undefined && linkList != projectLinks['linkList']){
            setLinkList(projectLinks['linkList']);
        }
    
        if(projectViewProject['projectCreationDate'] != undefined){
            const tempDate = projectViewProject['projectCreationDate'].split('T')
            projectViewProject['projectCreationDate'] = tempDate[0];
        }
    
        if(projectViewSale['projectCreationDate'] != undefined){
            const tempDate = projectViewSale['projectCreationDate'].split('T')
            projectViewSale['projectCreationDate'] = tempDate[0];
        }

        projectOwner = {
            first_name: projectViewProject['first_name'],
            last_name: projectViewProject['last_name'],
            profile_picture: projectViewProject['profile_picture'],
            job_title: projectViewProject['jobTitle'],
        }
    
        salesOwner = {
            first_name: projectViewSale['first_name'],
            last_name: projectViewSale['last_name'],
            profile_picture: projectViewSale['profile_picture'],
            job_title: projectViewSale['jobTitle'],
        }
    }


    if(projectOrSale == 'sale'){
        if(pvSalesNumber != undefined && originalProjectNumber != pvSalesNumber){
            setOriginalProjectNumber(pvSalesNumber);
        }

        if(activeUser.id == projectViewSale['owner_id'] && owner != true){
            setOwner(true);
        }
    
        if(salesLinks != undefined && linkList != salesLinks['linkList']){
            setLinkList(salesLinks['linkList']);
        }
    
        if(projectViewSale['projectCreationDate'] != undefined){
            const tempDate = projectViewSale['projectCreationDate'].split('T')
            projectViewSale['projectCreationDate'] = tempDate[0];
        }


        projectOwner = {
            first_name: projectViewSale['first_name'],
            last_name: projectViewSale['last_name'],
            profile_picture: projectViewSale['profile_picture'],
            job_title: projectViewSale['jobTitle'],
        }

        projectViewProject['projectNumber'] = projectViewSale['projectNumber'];
        projectViewProject['clientName'] = projectViewSale['clientName'];
        projectViewProject['projectName'] = projectViewSale['projectName'];
        projectViewProject['owner_id'] = projectViewSale['owner_id'];
        projectViewProject['projectCreationDate'] = projectViewSale['projectCreationDate'];
        projectViewProject['file_path'] = projectViewSale['file_path'];

    }

    useEffect (() => {
        getAssignedProjects(pvSalesNumber,setAssignedProjects)
    }, [pvProjectNumber, pvSalesNumber])

    if(assignedProjects.length >= 1 && converted == false){
        setConverted(true);
    }

    const css = []
    if(submitError){
        css['--submitColor'] = 'red';
    }
    if(submitSuccess){
        css['--submitColor'] = 'green';
    }
    if(!submitError && !submitSuccess){
        css['--submitColor'] = 'black';
    }

    if(cpSubmitError){
        css['--cpSubmitColor'] = 'red';
    }
    if(cpSubmitSuccess){
        css['--cpSubmitColor'] = 'green';
    }
    if(!cpSubmitError && !cpSubmitSuccess){
        css['--cpSubmitColor'] = 'black';
    }


    const editClick = () => {
        if(buttonText == "Submit"){
            setbuttonText("Edit");
            setEditable('false');
            setPVLoading(true);

            handlePVSubmit(setPVSubmitMessage,setPVLoading,setPVError,setPVSuccess,selectedProjectManager).then()
        }
        else{
            setbuttonText("Submit");
            setEditable('true')
            if(projectOrNot)
                getProjectManagers(setProjectManagers);
            else{
                getSalesmen(setProjectManagers);
            }
        }
    }
    
    const handleCancel = () => {
        setEditable('false');
        setbuttonText("Edit");
        handleProjectClick(originalProjectNumber,true);
    }

    const handleLinkClick = linkName => {
        if(linkName == 'Project Folder'){
            window.open('localexplorer:'+activeUser.base_url+projectViewProject['file_path']);
        }
        else{
            window.open('localexplorer:'+activeUser.base_url+projectViewProject['file_path']+"/"+linkName);
        }
    }

    const handleSalesClick = () => {
        setProjectView(false);
        handleProjectClick(projectViewSale['projectNumber'],true)
    }

    const handleAssignedClick = (projectNumber) => {
        setProjectView(false);
        handleProjectClick(projectNumber,true)
    }

    const handleClose = () => {
        setProjectView(false);
    }


    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const setErrorReport = (message, setError, setMessage, setLoading) => {
        setError(true);
        setMessage(message);
        sleep(2000).then( res => {
            setError(false);
            setLoading(false);
            setMessage("Please Wait... Loading...");
          })
    }

    const checkProjectNumber = ( redirect, projectNumber, customerNumber, type, owner, setLoading, setMessage, setError, setSuccess ) => {  
        if(projectNumber.length == 7){
            let newProjectNumber = ""

            if(type == "Project"){
                newProjectNumber = "P"+projectNumber
            }
            if(type == "Warranty"){
                newProjectNumber = "W"+projectNumber
            }
            if(type == "Maintenance"){
                newProjectNumber = "M"+projectNumber
            }

            isProjectNumberUnique(apiToken,newProjectNumber).then(response => {
                if(response.data.unique == true){                        
                    handleCPSubmit( redirect, newProjectNumber, customerNumber, type, owner, setLoading, setMessage, setError, setSuccess, closeReassignWindow );
                }
                else{
                    setErrorReport("Invalid Project Number... Please enter a unique 7 digit project number.", setError, setMessage, setLoading);
                    return false;
                }
            })

        }
        else{
            setErrorReport("Invalid Project Number... Please enter a 7 digit project number.", setError, setMessage, setLoading);
            return false;
        }
    }

    const checkCPFields = (convertCustomerNumber) => {
        if(convertCustomerNumber == ""){
            setErrorReport("Invalid Input... Please check the fields and resubmit", setCPSubmitError, setCPSubmitMessage, setCPLoading);
            return false;
        }
        return true;
    }

    const handleConvertClick = () => {
        setCPLoading(true);
        if(checkCPFields(convertCustomerNumber)){
            checkProjectNumber(true, convertProjectNumber,convertCustomerNumber, projectType, activeUser.id, setCPLoading, setCPSubmitMessage, setCPSubmitError, setCPSubmitSuccess);
        } 
    }

    const handleTypeChange = (selection) => {
        setProjectType(selection);
    }

    if(projectViewProject.archived == true && archived == false){
        setArchived(true);
    }
    if(projectViewProject.archived == false && archived == true){
        setArchived(false);
    }

    const handleArchivedClick = () => {
        if(projectViewProject.archived === false){
            setNewlyArchived(true);
        }
        projectViewProject.archived = (!projectViewProject.archived);
        setArchived(projectViewProject.archived);
    }

    const closeReassignWindow = () => {
        setNewlyArchived(false);
    }

    const handleReassignSubmit = () => {

    }

    const convertProjectProps = {
        handleReassignSubmit:handleReassignSubmit,
        projectManagers:projectManagers,
        closeReassignWindow:closeReassignWindow,
        checkProjectNumber:checkProjectNumber,
        setErrorReport:setErrorReport,
        convertCustomerNumber:convertCustomerNumber,
    }

    const handleSentClick = () => {
        setSaleSubmitted(!saleSubmitted);
        projectViewSale.submitted = !projectViewSale.submitted;
    }

    const convertDate = (originalDate) => {
        try{
            const date = originalDate.split("T");
            const newDate = date[0]
    
            const dateBreakdown = newDate.split("-");
            const tempDate = dateBreakdown[1]+"-"+dateBreakdown[2]+"-"+dateBreakdown[0]
    
            return tempDate;
        }
        catch{
            console.log("Failed to convert Date")
        }
    }


    
    return (
        <>
        <div className='Project-View-Background' onClick={e => handleClose()}/>

        <div className='Project-View-Window'>
            <div className='PV-Header'>

                <div className='PV-Header-Label-Container'>
                    <EditTag object={projectViewProject} field={'projectNumber'} editable={editable} fontSize={fontSize} textColor={'white'} textarea={false} maxLength={8}/>
                    <EditTag object={projectViewProject} field={'clientName'} editable={editable} fontSize={fontSize} textColor={'white'} textarea={false} maxLength={25}/>
                    <EditTag object={projectViewProject} field={'projectName'} editable={editable} fontSize={fontSize} textColor={'white'} textarea={false} maxLength={25}/>
                </div>

                <div className='PV-Header-UserPanel'>
                {   editable =='false' &&
                        <UserPanel user={projectOwner} maxHeight={80}/>
                    }
                    {   editable =='true' && !activeUser.is_admin &&
                        <UserPanel user={projectOwner} maxHeight={80}/>
                    }
                    {   editable =='true'  && activeUser.is_admin &&
                        <DropDownSelector defaultValue={projectViewProject.owner_id} providedArray={projectManagers} setSelectionFunction={setSelectedProjectManager} />
                    }
                </div>
            </div>

            <div className='PV-Scroll-Window'>
                
                <div className='PV-Primary-Window'>

                    <div className='PV-Primary-Left-Window'>
                        <div className='PV-Summary-Window'>
                            <div className='PV-Summary-Left'>
                                <div className='PV-Summary-Street PV-Med-Dynamic'>
                                    <EditTag object={projectViewSale} field={'projectStreet'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false}/>
                                </div>

                                <div className='PV-Summary-CityState PV-Med-Dynamic'>
                                    <EditTag object={projectViewSale} field={'projectCity'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={25}/>
                                    <div> </div>
                                    <EditTag object={projectViewSale} field={'projectState'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={2}/>
                                    <div> </div>
                                    <EditTag object={projectViewSale} field={'projectZip'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={25}/>
                                </div>

                                <div className='PV-Summary-Date'>
                                    <label>Created on:</label>
                                    <label className='PV-Project-Date'>{projectViewProject['projectCreationDate']}</label>
                                </div>

                                { projectOrNot &&
                                    <div className='PV-Summary-Sage'>
                                        <label>Customer Number:</label>
                                        <EditTag object={projectViewProject} field={'sage_number'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} maxLength={8} textarea={false}/>
                                    </div>
                                }

                                { !projectOrNot &&
                                <>
                                    <div className='PVS-Contact-Container'>
                                        <label>Primary Contact:</label>
                                        <div className='PVS-Name-Container'>
                                            <EditTag object={projectViewSale} field={'contactFirstName'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={25}/>
                                            <div> </div>
                                            <EditTag object={projectViewSale} field={'contactLastName'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={25}/>
                                            <div>(  </div>
                                            <EditTag object={projectViewSale} field={'contactTitle'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={25}/>
                                            <div>)</div>
                                        </div>
                                        <EditTag object={projectViewSale} field={'contactPhoneNumber'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={10}/>
                                        <EditTag object={projectViewSale} field={'contactEmail'} editable={editable} fontSize={secondaryFontSize} textColor={'black'} fontWeight={secondaryFontWeight} textarea={false} maxLength={25}/>
                                    </div>
                                    <div className='PVS-Detail-Container'>
                                        <label>Sent to Client:</label>
                                        {   saleSubmitted && editable == 'false' &&
                                            <label className='PVS-Text-Primary'>Yes - Submitted on {convertDate(projectViewSale.submittedDate)}</label>
                                        }
                                        {   !saleSubmitted && editable == 'false' &&
                                            <label className='PVS-Text-Primary'>No</label>
                                        }

                                        {   editable == 'true' &&
                                            <input type='checkbox' checked={saleSubmitted} onChange={e => handleSentClick()}/>
                                        }
                                    </div>
                                </>
                                }


                            </div>
                            <div className='PV-Summary-Right'>

                            </div>
                        </div>


                        <div className='PV-Link-Container'>
                                {   editable =='true'  && projectOrNot &&
                                    <div className='PV-Archived-Container'>
                                        <label className='Checkbox-Label'>Archived</label>
                                        <input type="checkbox" className='PV-Archived-Checkbox' checked={archived} onChange={e => handleArchivedClick()}/>

                                        {/* <input defaultValue={projectViewProject['file_path']} className='PV-Archived-Path' onChange={e => projectViewProject['file_path'] = e.target.value}/> */}
                                    </div>
                                }
                            <label className='PV-Link-Header'>Project Links</label>
                                <div className='PV-Link PV-Link-Base' onClick={e => {handleLinkClick(e.currentTarget.textContent)}}>
                                    Project Folder
                                </div>
                            {   
                                linkList.map((name, key) => {
                                    return(
                                        <div className='PV-Link' key={key} onClick={e => {handleLinkClick(e.currentTarget.textContent)}}>
                                            {name}
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>

                    <div className='PV-Primary-Right-Window'>

                        <div className='PV-Narrative-Container'>
                            <label className='PV-Narrative-Header'>Project Overview</label>
                            <EditTag object={projectViewSale} field={'projectNarrative'} editable={editable} fontSize={14} textColor={'white'} textarea={true}/>
                        </div>

                        {   owner &&
                        <div className='Button-Group'>

                        { editable =='true' && 
                        <button className='Edit-Button' onClick={handleCancel}>Cancel</button>
                        }

                        <button className='Edit-Button' onClick={editClick}>{buttonText}</button>
                        </div>
                        }

                        {   loading &&
                            <label className='PV-Submit-Message' style={css}>{submitMessage}</label>
                        }

                    </div>
                </div>

                { newlyArchived &&
                    <ConvertProject {...convertProjectProps}/>
                }

                { projectOrNot &&
                <div className='PV-Sales-Window'>

                    <div className='PV-Sales-Header PV-Inner-Header'>
                        <label className='PV-Header-Title'>Sales & Estimating</label>
                    </div>

                    <div className='PV-Sales-Primary'>

                        <div className='PVS-Left'>

                            <label className='PVS-Number' onClick={e => {handleSalesClick()}}>{projectViewSale['projectNumber']}</label>

                            <div className='PV-Summary-Date'>
                                    <label>Created on:</label>
                                    <label className='PV-Project-Date'>{projectViewSale['projectCreationDate']}</label>
                            </div>

                            <div className='PVS-Contact-Container'>
                                <label>Primary Contact:</label>
                                <label className='PVS-Text-Primary'>{projectViewSale['contactFirstName'] + " " + projectViewSale['contactLastName'] + "  (" + projectViewSale['contactTitle'] + ")"}</label>
                                <label className='PVS-Text-Secondary'>{projectViewSale['contactPhoneNumber']}</label>
                                <label className='PVS-Text-Secondary'>{projectViewSale['contactEmail']}</label>
                            </div>

                        </div>

                        <div className='PVS-Right'>
                            <div className='PVS-UserPanel'>
                                <UserPanel user={salesOwner} maxHeight={80}/>
                            </div>
                        </div>
                    </div>

                </div>
                }

                { !projectOrNot && converted &&
                    <div className='PV-Projects-Window'>
                        <div className='PV-Inner-Header'>
                            <label className='PV-Header-Title'>Assigned Projects</label>
                        </div>

                        {
                            assignedProjects.map((project, key) => {
                                return(
                                    <div key={key} className='PVS-Assigned-Project-Container'>
                                        <label className='PVS-Number' onClick={e => {handleAssignedClick(project['projectNumber'])}}> {project['projectNumber']}</label>
                                        <label className='PV-Med-Dynamic'>{"       Managed by:  " + project['ownerFirstName']  + " " + project['ownerLastName']}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                { !projectOrNot && projectManager &&
                    <div className='PV-Convert-Project-Window'>
                        <div className='PV-Inner-Header'>
                            <label className='PV-Header-Title'>Convert To Project</label>
                        </div>

                        <div className='PV-Convert-Directions'>
                            <label className='PV-Convert-Directions-Title'>General Directions</label>
                            <p className='PV-Convert-Directions-Text'>{generalDirections}</p>
                        </div>

                        <div className='PV-Convert-Form'>
                            <input className='PV-Convert-Input' maxLength={7} placeholder='Please Enter a Project Number...' onChange={e => {setConvertProjectNumber(e.target.value)}}/> 
                            <input className='PV-Convert-Input' maxLength={8} placeholder='Please Enter the Customer Number...' onChange={e => {setConvertCustomerNumber(e.target.value)}}/>
                            <select id="PV-Project-Type" className='PV-Convert-Input' onChange={ e => {handleTypeChange(e.target.value)}} >
                                <option value="Project">Project</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Warranty">Warranty</option>
                            </select>
                            {/* <input className='PV-Convert-Input' placeholder='Please Enter the Project Type...' onChange={e => {setConvertProjectType(e.target.value)}}/> */}
                            { cpLoading &&
                                <label style={css} className='PV-Convert-Message'>{cpSubmitMessage}</label>
                            }
                            <button className='PV-Convert-Button' onClick={e => handleConvertClick()}>Submit</button>
                        </div>
                    </div>
                }
                
            </div>


        </div>
        </>

    );
}

export default ProjectView;


