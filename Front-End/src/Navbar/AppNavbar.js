import './AppNavbar.css';
import NavBarLink from './NavBarLink'

const AppNavbar = ({NavList, navSelected, handleClick}) => {
    return (
        <div className="App-Navbar">
            {NavList.map((navLink, i) => (
                <NavBarLink
                key={i}
                DashIcon={navLink.DashIcon}
                title={navLink.title}
                navSelected={navSelected}
                handleClick={handleClick}
                />
            ))}
        </div>
    );
}

export default AppNavbar;
