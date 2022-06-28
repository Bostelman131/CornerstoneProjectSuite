import './OfficeInformation.css'
import wifiPicture from './ref/wifi.png'
import phone from './ref/phone.jpg'
import floorplan from './ref/floorplan.jpg'

const OfficeInformation = ( { header, address, internetUsername, internetPassword } ) => {
    return(
        <div className='Office-Information-Window'>
            <div className='OI-Header'>
                <div className='OI-Header-Primary'>{header}</div>
                <div className='OI-Header-Secondary'>{address}</div>
            </div>

            <div className='OI-Primary-Window'>

            <div className='OI-Left-Pane'>
                <div className='OI-Internet-Details'>
                    <h2>Wifi Sign-In Information</h2>
                    <div className='OI-Small-Container'>
                        <label className='OI-Label'>Network: </label>
                        <label className='OI-Data'>{internetUsername}</label>
                    </div>
                    <div className='OI-Small-Container'>
                        <label className='OI-Label'>Password: </label>
                        <label className='OI-Data'>{internetPassword}</label>
                    </div>
                    <div className='OI-Small-Container'>
                        <img src={wifiPicture} className="Wifi-Stamp" alt="Cornerstone Wifi" />
                    </div>

                </div>

                <div className='OI-Small-Container'>
                        <img src={floorplan} className="Floorplan" alt="Cornerstone Floorplan" />
                </div>
            
            </div>

            <div className='OI-Right-Pane'>
                <div className='OI-Phone-List'>
                    <img src={phone} className="Phone-List" alt="Cornerstone Phone List" />
                </div>
            </div>

            </div>
        </div>
    )
}

export default OfficeInformation;