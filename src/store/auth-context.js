import React, { useCallback, useEffect, useState } from "react";

export const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: token => {},
  logout: () => {}
});



const calRemainingTime = expirationTime => {
  const currentTimestamp = new Date().getTime();                                       
  const expirationTimestamp = new Date(expirationTime).getTime();     
  return expirationTimestamp - currentTimestamp;
}

let logoutTimer;

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calRemainingTime(storedExpirationDate);

  if(remainingTime <= 60000) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime')
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime
  }
}

export const AuthContextProvider = props => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token
  }
  const [token, setToken] = useState(initialToken); 

  const userIsLoggedIn = Boolean(token);

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    if(logoutTimer) clearTimeout(logoutTimer);
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime)

    const remainingTime = calRemainingTime(expirationTime);
    logoutTimer= setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration)
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler])

  const authContextData = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  }

  return (
    <AuthContext.Provider value={authContextData}>
      {props.children}
    </AuthContext.Provider>
  )
};

export default AuthContext;