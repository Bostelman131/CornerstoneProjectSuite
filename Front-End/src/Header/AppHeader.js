import headerImage from './refs/headerImage.jpg';
import SearchBar from './SearchBar'
import UserPanel from '../UserPanel/UserPanel'
import './AppHeader.css';
import {FaRegWindowClose} from "react-icons/fa";

const AppHeader = ( {user, searchbarProps, maxHeight, toggleUserMenu, searchTerms, getAll}) => {

  const UserPanelProps = {
    user : user,
    maxHeight : maxHeight
  }

  return (
      <header className="App-Header">
        <img src={headerImage} className="Header-Image" alt="Cornerstone" />
        <div className = 'Header-Controls'>
          {searchTerms &&
            <FaRegWindowClose className='Header-Clear-Searches-Button' onClick={e => getAll()}/>
          }
          <SearchBar {...searchbarProps}/>
          <div >
            <div className="User-Panel-Header" onClick={toggleUserMenu}>
              <UserPanel {...UserPanelProps} extend={true}/>
            </div>
          </div>
        </div>
      </header>
  );
}

export default AppHeader;