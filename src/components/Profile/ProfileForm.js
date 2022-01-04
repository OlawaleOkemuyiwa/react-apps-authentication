import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const passwordInputRef = useRef(null);

  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();

  const passwordSubmitHandler = async (event) => {
    event.preventDefault();

    const enteredNewPassword = passwordInputRef.current.value;
    
    //Add Validation

    try {
      await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyC10myv-0cDjhwdwT_i6T8URC3xUxfw6x8', {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      //assumption: request always successful with no error (will add proper error handling later)

      navigate('/', {replace: true})

    } catch (error) {
      //no code yet
    }    
  }

  return (
    <form onSubmit={passwordSubmitHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' ref={passwordInputRef} minLength="7" id='new-password' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
