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
  return expirationTimestamp - currentTimestamp;    //in milliseconds
}

let logoutTimer; 

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calRemainingTime(storedExpirationDate);  

  if (remainingTime <= 60000) {             //if the remaining time for the logIn status to expire is 1 mins or less than that (so no need to automatically log user in as time is almost up instead the user should log in manually)
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime')
    return null;
  }

  //but if the remaining time is more than a minute(> 60s), then the user token can be retrieved and should be automatically logged In cause there is enough time left
  return {
    token: storedToken,
    duration: remainingTime
  }
}

export const AuthContextProvider = props => {
  const tokenData = retrieveStoredToken();
  let initialToken = null;
  if (tokenData) {
    initialToken = tokenData.token;
    //logoutTimer would have been implemented here but since logoutHandler can't be accessed here it is set in useEffect down after logoutHandler has been initialized.
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
    logoutTimer = setTimeout(logoutHandler, remainingTime);     //after the remaining time(3600s/60mins/1hr i.e when sign In expires) automatically log user out
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);    //after the user is Logged in automatically, then also log the user out automatically when his or her time left is exhausted
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