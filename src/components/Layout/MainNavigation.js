import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const userIsLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  }
  
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to='/'>React Auth</Link>
      </div>
      <nav>
        <ul>
          {!userIsLoggedIn && (
            <li>
              <Link to='/auth'>Login</Link>
            </li>
          )}
          {userIsLoggedIn && (
            <li>
                <Link to='/profile'>Profile</Link>
            </li>
          )}
          {userIsLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
