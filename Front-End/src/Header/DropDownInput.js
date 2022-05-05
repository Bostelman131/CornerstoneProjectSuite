import './DropDownInput.css';
import { useState } from 'react'


const DropDownInput = ({ Label, currentText,  SearchBarText, filterFunction , select=false, options=null}) => {
    const [ inputValue, setValue ] = useState("");

    if(inputValue != currentText){
        setValue(currentText);
    }

    if(select){
        return (        
            <>
                <label className='Drop-Down-Label'>
                {Label}
                </label>
                    <select id="Drop-Down-Search-Type" className='Drop-Down-Search' defaultValue={inputValue} onChange={ (e) => filterFunction(e.target.value)} >
                        {
                            options.map((value,key) => {
                                return(
                                    <option key={key} value={value}>{value}</option>
                                )
                            })
                        }
                    </select>  
            </>                
    
        )
    }
    else{
        return (        
            <>
                <label className='Drop-Down-Label'>
                {Label}
                </label>
                <input
                className='Drop-Down-Search'
                name="Input-Box"
                type="text"
                
                placeholder={SearchBarText}
                value={currentText}
                onChange={(e) => filterFunction(e.target.value)}
                />   
            </>                

        )
    }

}

export default DropDownInput;