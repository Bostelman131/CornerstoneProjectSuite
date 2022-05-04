import './UserPanel.css';
import { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

const UserPanel = ({user, maxHeight, extend=false, primaryFontSize=18, secondaryFontSize=15, bold=true}) => {
    const [ extended, setExtended ] = useState(false);
    const nodeRef = useRef(null);

    let cssProps = { }
    cssProps['--maxHeight'] = maxHeight.toString()+"px";
    cssProps['--primaryFontSize'] = primaryFontSize.toString()+"px";
    cssProps['--secondaryFontSize'] = secondaryFontSize.toString()+"px";


    if(bold){
        cssProps['--fontWeight'] = "700";
    }
    else{
        cssProps['--fontWeight'] = "500";
    }

    if( extend ) {
        return (
            <CSSTransition in={extended} timeout={700} classNames="User-Panel-Extend" nodeRef={nodeRef}>
            <div style={cssProps} className="User-Panel" onMouseEnter={event => setExtended(true)} onMouseLeave={event => setExtended(false)}>
                <img className='User-Panel-Image' src={user.profile_picture} >
                </img>

                { extended &&
                    <div className='User-Panel-Text' ref={nodeRef}>
                        <h4 className='User-Panel-Username Text-Primary'>
                            {user.first_name} {user.last_name}
                        </h4>
                        <h5 className='User-Panel-Title Text-Secondary'>
                            {user.job_title}
                        </h5>
                    </div>
                }
            </div>
            </CSSTransition>
        );
    }

    return (
        <div style={cssProps} className="User-Panel">
            <img className='User-Panel-Image' src={user.profile_picture} >
            </img>
            <div className='User-Panel-Text' >
                <label className='User-Panel-Username Text-Primary'>
                    {user.first_name} {user.last_name}
                </label>
                <label className='User-Panel-Title Text-Secondary'>
                    {user.job_title}
                </label>
            </div>
        </div>
    );
}

export default UserPanel;