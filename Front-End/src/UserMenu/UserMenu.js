import './UserMenu.css';
import { useState } from 'react';
import AccountMenu from './AccountMenu/AccountMenu';

const UserMenu = ({user, maxHeight, UserMenuWidth, toggleUserMenu, UMQuickLinks, UMSettingLinks, UMAppLink, token, setActiveUserData}) => {
    let cssProps = { }
    cssProps['--maxHeight'] = maxHeight.toString()+"px";
    cssProps['--menuWidth'] = UserMenuWidth.toString()+"px";

    function handleClose() {
        toggleUserMenu();
    }

    function handleClick(func, keyName, close) {
        func();
        if (close) {
            handleClose();
        }
    }

    const [ accountMenuToggle, setAccountMenu ] = useState(false);
    const [ accountObject, setAccountObject ] = useState(null);

    function handleAccountClick(object) {
        setAccountObject(object);
        setAccountMenu(true);
    }

    return (
        <>
        <div className='User-Menu-Background' onClick={handleClose} >
        </div>

        <div className="User-Menu" style={cssProps}>

            <div className='UM-Top-Container' >
                <div className='UM-Greeting-Section'>
                    <h1 className='UM-Greeting-Header UM-Name'>
                        Hello, {user.first_name}
                    </h1>
                    <h1 className='UM-Greeting-Header'>
                        Your Account
                    </h1>
                </div>
                <div className='UM-Pic-Section'>
                    <img className='User-Menu-Image' src={user.profile_picture} style={cssProps} alt='User-Image' onClick={e => handleClose(e)}>
                    </img>
                </div>
            </div>

            <div className='UM-Middle-Container'>


                <div className='UM-Project-Section UM-Mid-Section' >
                    <h2 className='UM-Category-Header'>
                        Quick Links
                    </h2>
                    {Object.keys(UMQuickLinks).map((keyName, i) => 
                    <div key={i} className='UM-Link-Container'>
                        <label className='UM-Link' onClick={() => handleClick(UMQuickLinks[keyName],keyName,true)}>
                            {keyName}
                        </label>
                    </div> 
                )}
                </div>


                <div className='UM-Account-Section UM-Mid-Section' >
                    <h2 className='UM-Category-Header'>
                        Account Settings
                    </h2>
                    {UMSettingLinks.map((object, i) => 
                    <div key={i} className='UM-Link-Container'>
                        <label className='UM-Link' onClick={() => handleAccountClick(object)}>
                            {object.name}
                        </label>
                    </div> 
                )}
                </div>


                <div className='UM-App-Section UM-Mid-Section' >
                    <h2 className='UM-Category-Header'>
                        General
                    </h2>
                    {Object.keys(UMAppLink).map((keyName, i) => 
                    <div key={i} className='UM-Link-Container'>
                        <label className='UM-Link' onClick={() => handleClick(UMAppLink[keyName],false)}>
                            {keyName}
                        </label>
                    </div> 
                )}
                </div>
                { accountMenuToggle &&
                    <AccountMenu className='Account-Menu' user={user} token={token} accountObject={accountObject} setAccountMenu={setAccountMenu} UserMenuWidth={UserMenuWidth} setActiveUserData={setActiveUserData}/>
                }

            </div>



        </div>
        </>        
    );
}

export default UserMenu;