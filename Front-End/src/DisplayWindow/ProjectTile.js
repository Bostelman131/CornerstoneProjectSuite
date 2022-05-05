import './ProjectTile.css';
import UserPanel from '../UserPanel/UserPanel';
import { useState } from 'react';

function ProjectTile({ clientName, projectName, projectNumber, archived, projectCreationDate, file_path, first_name, last_name, profile_picture, jobTitle, url, handleProjectClick}) {
    
    const status = "In Progress";
    if( archived ){
        const status = "Completed";
    }    

    const statusColor = (status == 'Completed') ? 'green' : 'black';

    let cssProps = { }
    cssProps['--statusColor'] = statusColor;

    const handleProjectTileClick = (event) => {
        handleProjectClick(projectNumber);
    }

    try{
        const date = projectCreationDate.split("T");
        projectCreationDate = date[0]
        const dateBreakdown = projectCreationDate.split("-");
        const tempDate = dateBreakdown[1]+"-"+dateBreakdown[2]+"-"+dateBreakdown[0]
        projectCreationDate = tempDate;
    }
    catch{
        // Fuck the date
    }

    let user = {
        first_name:first_name,
        last_name:last_name,
        profile_picture:profile_picture,
        job_title:jobTitle,
        
    }

    let UserPanelProps = {
        user:user,
        maxHeight: 55,
        primaryFontSize: 16,
        secondaryFontSize: 12,
        bold:false,
    }

    return(
        <div className='ProjectTile-Window'  onClick={handleProjectTileClick}>
            <div className='Project-Description-Box Hover-Pointer'>

                <label className='Project-Description-Name Hover-Pointer'>
                    {clientName}
                </label>
                <label className='Project-Description-Project Hover-Pointer'>
                    {projectName}
                </label>

            </div>
            <div className='Project-Tile-Center-Box Hover-Pointer'>
                {/* <div className='Project-Status-Box Hover-Pointer'>
                    <label className='Center-Box-Label Hover-Pointer'>
                        Status: 
                    </label>
                    <label className='Center-Box-Data Hover-Pointer'>
                        {status}
                    </label>
                </div> */}
                <div className='Project-Date-Box Hover-Pointer'>
                    <label className='Project-Description-Number Hover-Pointer'>
                        {projectNumber}
                    </label>
                    <label className='Center-Box-Label Hover-Pointer'>
                        Creation Date:
                    </label>
                    <label className='Center-Box-Data Hover-Pointer'>
                        {projectCreationDate}
                    </label>
                </div>
            </div>
            <div className='Project-User-Box'>
                <UserPanel {...UserPanelProps}/>
            </div>
        </div>
    );
}

export default ProjectTile;
