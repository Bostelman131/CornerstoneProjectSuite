import './SalesOpp.css';
import { useState } from 'react'

function SalesOpp({SalesFormObject, user, salesFormTextHeight, salesFormTextAreaHeight, homeView, salesDirections, token, createSales,getAll}) {

    const [ loading, setLoading ] = useState(false);
    const [ submitMessage, setSubmitMessage ] = useState("Please Wait... Creating Sales Opportunity...");
    const [ submitError, setSubmitError ] = useState(false); 
    const [ submitSuccess, setSubmitSuccess ] = useState(false);
    
    let cssProps = { }
    cssProps['--inputHeight'] = salesFormTextHeight;
    cssProps['--inputAreaHeight'] = salesFormTextAreaHeight;

    if(submitError){
        cssProps['--submitMessage'] = 'red';
    }
    else if(submitSuccess){
        cssProps['--submitMessage'] = 'green';
    }
    else{
        cssProps['--submitMessage'] = 'black';
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const cancelForm = () => {
        homeView();
    }

    const [ formError, setFormError ] = useState(false)
    const [ missingElements, setMissingElements ] = useState([])

    const setSalesError = (str) => {
        setSubmitError(true);
        setSubmitMessage(str);
    }

    const fadeFormMessage = () => {
        sleep(2000).then( res => {
            setLoading(false);
            setSubmitMessage("Please Wait... Creating Sales Opportunity...");
        });
    }

    const checkSpecialChar = (str) => {
        if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str)) {
            return true;
        }

        return false;
    }

    const handleSubmit = () => {
        setLoading(true);
        setSubmitError(false);
        setSubmitSuccess(false);

        let missingFields = [];

        SalesFormObject.map((object, key) => {
            if(object["value"] == ""){
                missingFields.push(object["name"]);
            }
        })

        if(checkSpecialChar(SalesFormObject[0].value)) {
            setSalesError("Client Name Should Not Contain Special Characters");
            fadeFormMessage();
            return false;
        }

        if(checkSpecialChar(SalesFormObject[1].value)) {
            setSalesError("Project Name Should Not Contain Special Characters");
            fadeFormMessage();
            return false;
        }

        if(missingFields.length <= 0){
            createSales(token,user.id, SalesFormObject).then(response => {
                if(response.status === 201){
                    setSubmitSuccess(true);
                    setSubmitMessage("Successfully Created a Sales Opportunity... Redirecting Soon...");

                }
                else{
                    setSalesError("Failed to Create the Sales Opportunity... If this issue persists, please contact your system admin.")
                }

                fadeFormMessage();
                getAll();
                homeView();
                window.open('localexplorer:'+user.base_url+response.data['salesFilePath']);
            });
        }

        else{
            setSalesError("Please enter all fields to create a sales opportunity.");
            fadeFormMessage();
        }
    }

    return(
        <div className='SalesOpp-Window'>
            <div className='Sales-Form'>
                <h1 className='SF-Title'>
                    Cornerstone Sales Opportunity Portal
                </h1>
                {
                    SalesFormObject.map((object, key) =>
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

                {   formError &&
                    <label className='SF-Error'>
                        Please Enter {missingElements[0]} and Resubmit
                    </label>
                }
                {   loading && 
                    <div style={cssProps} className='SF-Message'>{submitMessage}</div>
                }

                <div className='SF-Button-Group'>
                    <button className='SF-Cancel-Button SF-Button' onClick={cancelForm}>Cancel</button>
                    <button className='SF-Submit-Button SF-Button'onClick={e => handleSubmit()}>Submit</button>
                </div>
            </div>

            <div className='SalesOpp-Right-Panel-Window'>
                <div className='SalesOpp-Directions'>
                    <label className='SD-Title'>
                        {salesDirections["title"]}
                    </label>
                    <p className='SD-Primary'>
                        {salesDirections["primary"]}
                    </p>
                </div>
                <div className='SalesOpp-Upload-Window'>
                    <label className='SD-Title'>Form Link to Share</label>
                    <p>https://forms.gle/oebg22BTUD5s2Rbg8</p>

                    {/* <div className='SalesOpp-Upload-Portal'>
                        <label className='SD-Title'>Drag & Drop Quick Create</label>
                        <p>Coming Soon!</p>
                    </div> */}

                </div>
            </div>

        </div>
    );
}

export default SalesOpp;