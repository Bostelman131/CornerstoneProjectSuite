import './NetworkStatus.css';

function NetworkStatus({ title, ip, status }) {
    let statusColor = 'grey'
    if( status == "Passed" ){
        statusColor = 'green'
    }
    if( status == "Failed" ){
        statusColor = 'red'
    }

    let cssProps = { }
    cssProps['--statusColor'] = statusColor;

    return(
        <div className='ND-Window' style={cssProps}>
            <label className='ND-Title'>{title}</label>
            <label className='ND-IP'>IP Address . . . . . . {ip}</label>
            <div className='ND-Status-Container'>
                <label className='ND-Status-Text'>Status . . . . . . . . . . </label>
                <label className='ND-Status-Data'>{status}</label>
            </div>
        </div>
    )
}

export default NetworkStatus;
