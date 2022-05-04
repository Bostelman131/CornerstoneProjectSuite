import './EditTag.css';
import { useState } from 'react'

const EditTag = ({ object, field, editable, fontSize, fontColor, fontWeight=400, textarea=false, maxLength }) => {
    const [ input, setInput ] = useState(object[field]);

    if(input != object[field]){
        setInput(object[field]);
    }

    if(input != undefined){
        let css = {}
        css['--inputWidth'] = ((input.length * (fontSize*.9))/1.80)+10 + "px";
        if(textarea){
            css['--containterWidth'] = '100%';
            css['--containterHeight'] = '100%';
        }
        else{
            css['--containterWidth'] = ((input.length * (fontSize*.9))/1.80)+10 + "px";
            css['--containterHeight'] = 'none';
        }
        css['--color'] = fontColor;
        css['--fontSize'] = fontSize + "px";
        css['--fontWeight'] = fontWeight;

    
        const handleInputChange = (value) => {
            setInput(value);
            object[field] = value
        }


        if(textarea == true){
            return(
                <div  style={css} className='Edit-Tag-Container'>
                    { editable == 'false' &&
                        <textarea style={css} type="text" value={input} className='Edit-Textarea Dynamic-Textarea' readOnly={true}/>
                    }
                    { editable == 'true' &&
                        <textarea maxLength={maxLength} style={css} type="text" value={input} className='Edit-Textarea Dynamic-Textarea' onChange={e => handleInputChange(e.target.value)}/>
                    }
                </div>
            )
        }
    
        else{
            return(
                <div  style={css} className='Edit-Tag-Container'>
                    { editable == 'false' &&
                        <label style={css} className='Dynamic-Text'>{input}</label>
                    }
                    { editable == 'true' &&
                        <input maxLength={maxLength} style={css} type="text" value={input} className='Edit-Input Dynamic-Text' onChange={e => handleInputChange(e.target.value)}/>
                    }
                </div>
            ) 
        }
    }


    else{
        return(
            <div className='Edit-Tag-Container'>
                Loading...
            </div>
        )
    }


}

export default EditTag;

