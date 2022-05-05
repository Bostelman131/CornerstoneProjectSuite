import './AccountMenu.css';
import { useState } from 'react';

const AccountMenu = ({user, accountObject, token, setAccountMenu, UserMenuWidth, setActiveUserData}) => {
    const [  errorMessage, setErrorMessage ] = useState("");
    const [  messageTriggered, setMessageTriggered ] = useState(false);
    const [  error, setError ] = useState(false);
    const [  successful, setSuccessful ] = useState(false);

    let cssProps = { }
    cssProps['--menuWidth'] = UserMenuWidth.toString()+"px";
    cssProps['--inputHeight'] = accountObject['height'];
    cssProps['--AMMessageColor'] = 'black';

    if(error){
        cssProps['--AMMessageColor'] = 'red';
    }
    if(successful){
        cssProps['--AMMessageColor'] = 'green';
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const delayedClose = () => {
        sleep(1500).then( res => {
            cancelRequest();
        });
    }

    function cancelRequest() {
        setAccountMenu(false);
    }

    const submitFunction = accountObject["function"]

    async function handleSubmit() {
        submitFunction(user, token, accountObject);
        //setAccountMenu(false);
    }

    accountObject['messageFunction'] = setErrorMessage;
    accountObject['setError'] = setError;
    accountObject['setSuccess'] = setSuccessful;
    accountObject['setActiveUserData'] = setActiveUserData;
    accountObject['id'] = user.id;
    accountObject['close'] = delayedClose;

    if(errorMessage == "" && messageTriggered == true){
        setMessageTriggered(false);
    }
    if(errorMessage != "" && messageTriggered == false){
        setMessageTriggered(true);
    }

    const handleChange = (type, input, fieldName) => {
        if(type === 'file'){
            accountObject[fieldName] = input.target.files[0]
        }
        else{
            accountObject[fieldName] = input.target.value
        }

    }

    return (
        <>
        {/* <div className='AM-Background' style={cssProps} onClick={e => setAccountSettings(false)}>
        </div> */}
        <div className='AM-Window' style={cssProps} >
            <h1 className='AM-Category-Header'>{accountObject["name"]}</h1>
            <div className='AM-Outer-Container'>
                <p>
                    {accountObject["tooltip"]}
                </p>
                {
                accountObject["fields"].map((fieldName, key) =>

                    <div key={key} className='AM-Inner-Container'>

                        <label className='AM-Label'>
                            {fieldName}
                        </label>   
                        { accountObject["textarea"] &&
                            <textarea
                            className='AM-Input AM-text-Area'
                            type={accountObject["type"]}
                            placeholder={accountObject[fieldName]}
                            onChange={e => accountObject[fieldName] = (e.target.value)}
                            />
                        }
                        { !accountObject["textarea"] &&
                            <input
                            autoComplete='new-password'
                            className='AM-Input'
                            type={accountObject["type"]}
                            placeholder={accountObject[fieldName]}
                            onChange={event => handleChange(accountObject["type"],event, fieldName)}
                            />
                        }
                        

                    </div>
                )}
            </div>
            { messageTriggered &&
                <label className='AM-Error-Message'>{errorMessage}</label>
            }
            <div className='AM-Button-Group'>
                <button className='AM-Cancel-Button AM-Button' onClick={cancelRequest}>Cancel</button>
                <button className='AM-Submit-Button AM-Button'onClick={e => handleSubmit()}>Submit</button>
            </div>
        </div>
        </>

    );
}

export default AccountMenu;
