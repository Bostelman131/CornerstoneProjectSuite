import './DisplayWindow.css';
import Dashboard from './Dashboard';
import SalesOpp from './SalesOpp';
import CreateUser from './CreateUser';
import NetworkDiagnostics from './NetworkDiagnostics';
import OfficeInformation from '../OfficeInformation/OfficeInformation'


function DisplayWindow( { navSelected, salesOppProps, createUserProps, networkProps, dashboardProps, officeInformation, pinnedProjectsProps, ...props } ) {

    switch (navSelected) {
        case "Dashboard":
            return(
                <div className='Display-Window'>
                    <Dashboard {...dashboardProps}/>
                </div>
            );

        case "Pinned Projects":
            return(
                <div className='Display-Window'>
                    <Dashboard {...dashboardProps}/>
                </div>
            );

        case "Create Sales Opportunity":
            return(
                <div className='Display-Window'>
                    <SalesOpp {...salesOppProps} />
                </div>
            );

        case "Create A User":
            return(
                <div className='Display-Window'>
                    <CreateUser {...createUserProps} />
                </div>
            );

        case "Archived Projects":
            return(
                <div className='Display-Window'>
                    <Dashboard {...dashboardProps}/>
                </div>
            );

        case "Archived Sales":
            return(
                <div className='Display-Window'>
                    <Dashboard {...dashboardProps}/>
                </div>
            );
        
        case "Network Diagnostics":
            return(
                <div className='Display-Window'>
                    <NetworkDiagnostics {...networkProps} />
                </div>
            );

        case "Office Information":
            return(
                <div className='Display-Window'>
                    <OfficeInformation {...officeInformation} />
                </div>
            ); 
            

        default:
            <div className='Display-Window'>
                Nothing to Display, Please Select a Nav Link on the Left Side.
            </div>
    }
}

export default DisplayWindow; 