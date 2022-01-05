import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);  //isLogin is state which signifies if user is about to Log in or not(therefore creating an account)
  const [isLoading, setIsLoading] = useState(false);
  
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const authCtx = useContext(AuthContext);
  
  const navigate = useNavigate();

  const toggleAuthModeHandler = () => {
    setIsLogin(latestState => !latestState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    //Optional validation for email and password

    setIsLoading(true);

    let url;
    if(isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC10myv-0cDjhwdwT_i6T8URC3xUxfw6x8';
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC10myv-0cDjhwdwT_i6T8URC3xUxfw6x8';
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 
          email: enteredEmail, 
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
  
      setIsLoading(false);
      
      const data = await response.json();  
      const { idToken, expiresIn } = data;      //expiresIn is the time the login section expires as specified by firebase which is '3600' or 60mins or 1hr 
      
      if(response.ok) {      
        const expirationTimestamp = new Date().getTime() + (parseInt(expiresIn) * 1000);
        const expirationTimeDateString = new Date(expirationTimestamp).toISOString();  
        authCtx.login(idToken, expirationTimeDateString);
        navigate('/', {replace: true});
      } else {
        let errorMessage = 'Authentication failed';
        errorMessage = data.error.message ? data.error.message : errorMessage;
        throw new Error(errorMessage);
      }
      
    } catch (error) {
      alert(error.message)
    }
    
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' ref={emailInputRef} id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' ref={passwordInputRef} id='password' required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={toggleAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
