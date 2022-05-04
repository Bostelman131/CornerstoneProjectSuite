import './NavBarLink.css';

const NavBarLink = ({DashIcon, title, navSelected, handleClick}) => {
    const triggered = navSelected == title ? true : false;
    const backgroundColor = triggered ? '#32584F' : 'white';
    const textColor = triggered  ? 'white' : '#32584F';
    const margin = triggered ? '15px' : '15px';
    const boxShadow = triggered ? 'none' : '2px 2px 3px 1px #888888';

    let cssProps = { }
    cssProps['--backgroundColor'] = backgroundColor;
    cssProps['--textColor'] = textColor;
    cssProps['--selectedMargin'] = margin;
    cssProps['--boxShadow'] = boxShadow;

    return (
        <div className="Navbar-Link" style={cssProps} onClick={(event) => handleClick(title)} >
            <DashIcon className='Navbar-Link-Icon' />
            <h4 className='Navbar-Link-Title'>
                {title}
            </h4>
        </div>
    );
}

export default NavBarLink;
