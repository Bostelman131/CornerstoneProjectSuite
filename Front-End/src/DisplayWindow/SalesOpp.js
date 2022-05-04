import './SalesOpp.css';
import { useState } from 'react'

function SalesOpp({SalesFormObject, user, salesFormTextHeight, salesFormTextAreaHeight, homeView, salesDirections, token, createSales,getAll}) {
    let cssProps = { }
    cssProps['--inputHeight'] = salesFormTextHeight;
    cssProps['--inputAreaHeight'] = salesFormTextAreaHeight;

    const cancelForm = () => {
        homeView();
    }

    const [ formError, setFormError ] = useState(false)
    const [ missingElements, setMissingElements ] = useState([])

    const handleSubmit = () => {
        setFormError(false);
        let missingFields = [];

        SalesFormObject.map((object, key) => {

            if(object["value"] == ""){
                missingFields.push(object["name"]);
            }
        })

        if(missingFields.length <= 0){
            createSales(token,user.id, SalesFormObject).then(response => {
                getAll();
                homeView();
                window.open('localexplorer:'+user.base_url+response.data['salesFilePath']);
            })
        }
        else{
            setFormError(true);
            setMissingElements(missingFields);
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

                {
                    formError &&
                    <label className='SF-Error'>
                        Please Enter {missingElements[0]} and Resubmit
                    </label>
                }

                <div className='SF-Button-Group'>
                    <button className='SF-Cancel-Button SF-Button' onClick={cancelForm}>Cancel</button>
                    <button className='SF-Submit-Button SF-Button'onClick={e => handleSubmit()}>Submit</button>
                </div>
            </div>

            <div className='SalesOpp-Directions'>
                <label className='SD-Title'>
                    {salesDirections["title"]}
                </label>
                <p className='SD-Primary'>
                    {salesDirections["primary"]}
                </p>
            </div>
        </div>
    );
}

export default SalesOpp;