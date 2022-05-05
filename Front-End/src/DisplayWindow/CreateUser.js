import './CreateUser.css';
import { useState } from 'react'

function CreateUser({createUserFormObject, user, token, createUserTextHeight, homeView, createUserDirections, createUser}) {
    
    let cssProps = { }
    cssProps['--inputHeight'] = createUserTextHeight;

    const [ formError, setFormError ] = useState(false);
    const [ missingElements, setMissingElements ] = useState([]);

    const [ createdSuccess, setCreatedSuccess ] = useState(false);
    const [ createdFailure, setCreatedFailure ] = useState(false);

    const cancelForm = () => {
        homeView();
    }

    const handleSubmit = () => {
        let userObject = {};

        createUserFormObject.map((object, key) => {
            if(object['value'] == "on"){
                userObject[object['dbTerm']] = true;
            }
            else{
                userObject[object['dbTerm']] = object['value'];
            }

            if(object['dbTerm'] == "password"){
                if(object['value'] == ""){
                    userObject[object['dbTerm']] = "CDP001";
                }
            }
        });

        createUser(token, userObject).then( res => {
            if(res.status == 201){
                setCreatedSuccess(true);
                sleep(800).then( res => {
                    setCreatedSuccess(false);
                    cancelForm();
                })
            }
            else{
                setCreatedFailure(true);
                sleep(1000).then( res => {
                    setCreatedFailure(false);
                })
            }
        })
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    return(
        <div className='SalesOpp-Window'>
            <div className='Sales-Form'>
                <h1 className='SF-Title'>
                    Cornerstone User Creation Portal
                </h1>
                {
                    createUserFormObject.map((object, key) =>
                        <div key={key} className='SF-Dynamic-Container' style={cssProps}>
                            <label className='SF-Label'>
                                {object["name"]}
                            </label>

                            {   object["textarea"] &&
                                <textarea
                                    className='SF-Input-Area SF-Input' 
                                    type={object["type"]}
                                    placeholder={object["placeHolder"]}
                                    onChange={e => object["value"] = e.target.value}
                                />
                            }

                            {   !object["textarea"] &&
                                <input
                                    className='SF-Input' 
                                    type={object["type"]}
                                    placeholder={object["placeHolder"]}
                                    maxLength={object["maxLength"]}
                                    onChange={e => object["value"] = e.target.value}
                                />
                            }
                        </div>
                )}

                {
                    formError &&
                    <label className='SF-Error'>
                        Please Enter {missingElements[0]} and Resubmit
                    </label>
                }

                {   createdSuccess &&
                    <label className='User-Successful'>Success - User was successfully added to the system.</label>
                }

                {   createdFailure &&
                    <label className='User-Failure'>Failure - User failed to be added to the system. Check to make sure the email or username doesn't already exist</label>
                }

                <div className='SF-Button-Group'>
                    <button className='SF-Cancel-Button SF-Button' onClick={cancelForm}>Cancel</button>
                    <button className='SF-Submit-Button SF-Button'onClick={e => handleSubmit()}>Submit</button>
                </div>
            </div>

            <div className='Create-User-Directions'>
                <label className='SD-Title'>
                    {createUserDirections["title"]}
                </label>
                <p className='SD-Primary'>
                    {createUserDirections["primary"]}
                </p>
            </div>
        </div>
    );
}

export default CreateUser;