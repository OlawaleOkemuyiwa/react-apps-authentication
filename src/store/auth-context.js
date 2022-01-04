import React, { useState } from "react";

export const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: token => {},
  logout: () => {}
});


const calRemainingTime = expirationTime => {
  const currentTimestamp = new Date().getTime();                                       
  const expirationTimestamp = new Date().getTime() + (parseInt(expirationTime) * 1000)      
  return expirationTimestamp - currentTimestamp;
}

export const AuthContextProvider = props => {

  const initialToken = localStorage.getItem('token');   //initialToken is token stored in localStorage if there is any and nothing is stored yet then it is undefined
  const [token, setToken] = useState(initialToken);  
  const userIsLoggedIn = Boolean(token);

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem('token')
  };

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);

    const remainingTime = calRemainingTime(expirationTime);
    setTimeout(logoutHandler, 3000);
  };

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