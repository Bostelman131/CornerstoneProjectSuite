import './NetworkDiagnostics.css';
import mapImage from '../refs/map.jpg';
import NetworkStatus from '../Network/NetworkStatus'

function NetworkDiagnostics({ networkStatus, networkLoading, getNetworkStatus,networkError }) {
    let ipStatus = {
        "Internet": "UNKOWN",
        "Local Server": "UNKOWN",
        "Montgomery Server": "UNKOWN",
        "Tanner Server": "UNKOWN",
    }

    let ipNames = {
        "Internet": "8.8.8.8",
        "Local Server": "172.18.50.2",
        "Montgomery Server": "172.18.50.3",
        "Tanner Server": "172.18.5.35",
    }
    
    try{
        for (const array of Object.entries(networkStatus)) {
            const name = array[0];
            const value = array[1];
            ipStatus[name] = value;
        }
    }
    catch{
        
    }

    let buttonColor = 'none'
    let buttonText = "Run Network Test"

    if(networkLoading == true){
        buttonText = "Loading..."
        buttonColor = 'lightgreen'
    }

    let cssProps = { }
    cssProps['--NDbuttonColor'] = buttonColor;

    return(
        <div className='NetworkDiagnostics-Window' style={cssProps}>
            {/* <div className='Network-Map-Container'>
                <img src={mapImage} className='Network-Map' alt='Network-Map'/>
            </div> */}
            <div className='Network-Data-Window'>
                <h1 className='ND-Header'>Network Status</h1>
                {Object.keys(ipStatus).map((keyName, i) => 
                    <NetworkStatus key={i} className='Network-Status-Object' title = {keyName} ip={ipNames[keyName]} status={ipStatus[keyName]}/>
                )}
                <button className='ND-Button' onClick={getNetworkStatus}>{buttonText}</button>
            </div>
        </div>
    );
}

export default NetworkDiagnostics;