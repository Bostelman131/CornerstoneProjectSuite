import './Dashboard.css';
import ProjectTile from './ProjectTile';
import { useRef } from 'react'

function Dashboard( { projects, user, handleProjectClick } ) {
    const scrollDiv = useRef();

    if(projects != undefined && projects.length > 0){
        return(
            <div className='Dashboard-Window' ref={scrollDiv}>
                {projects.map((project, i) => (
                    <ProjectTile
                    key={i}
                    url={user.base_url}
                    handleProjectClick={handleProjectClick}
                    {...project}
                    />
                ))}
            </div>
        );
    }

    else{
        return(
            <div className='Dashboard-Window No-Projects-Window' ref={scrollDiv}>
                <h1 className='DW-No-Projects-Label'></h1>
            </div>
        );
    }


}

export default Dashboard;