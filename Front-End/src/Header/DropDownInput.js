import './DropDownInput.css';


const DropDownInput = ({ Label, currentText,  SearchBarText, filterFunction , select=false, options=null}) => {

    if(select){
        return (        
            <>
                <label className='Drop-Down-Label'>
                {Label}
                </label>
                    <select id="Drop-Down-Search-Type" className='Drop-Down-Search' onChange={ (e) => filterFunction(e.target.value)} >
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