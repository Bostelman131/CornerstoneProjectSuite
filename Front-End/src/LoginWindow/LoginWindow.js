import { useState } from 'react';
import './LoginWindow.css';
import logo from '../refs/logo.jpg'
import loginText from '../refs/login.jpg'

const LoginWindow = props => {
    const [formUsername, setUsername] = useState("");
    const [formPassword, setPassword] = useState("");
    const [ forgotPassword, setForgotPassword ] = useState("");

    const login = () => {
        props.login({email:formUsername, password:formPassword});
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            login();
        }
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const forgotPasswordMessage = "Please contact your system administrator via email to request a password reset."

    const handleForgotPassword = () => {
        setForgotPassword(true);
        sleep(3000).then( res => {
            setForgotPassword(false);
        })
    }

    const toggleRemeberMe = () => {
        props.setRememberMe(!props.rememberMe);
        console.log(props.rememberMe);
    }

    return (
        <div className='Login-Window'>
            <div className="Login-Box">
                <img src={logo} className="Login-Image"/>
                <img src={loginText} className="Login-Image-Text"/>
                <div className='Input-Box'>
                    <label className='Input-Label'>
                        Email
                    </label>
                    <input
                        className='Input-Field'
                        type="text"
                        placeholder=""
                        onKeyDown={((e) => handleKeyDown(e))}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='Input-Box'>
                    <label className='Input-Label'>
                        Password
                    </label>
                    <input
                    className='Input-Field'
                    type="password"
                    placeholder=""
                    onKeyDown={((e) => handleKeyDown(e))}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {props.loginError && 
                    <label className='Login-In-Error-Message'> Incorrect Username or Password </label>
                }
                <div className='Checkbox-Box'>
                    <input type="checkbox" className='Checkbox-Input' onClick={e => toggleRemeberMe()}/>
                    <label className='Checkbox-Label' >
                        Remember me
                    </label>
                </div>
                <button className='Login-button' onClick={login} >
                    Login
                </button>
                {   forgotPassword &&
                    <label className='Forgot-Password-Message'>{forgotPasswordMessage}</label>
                }
                <label className='Forgot-Password-Button' onClick={e => handleForgotPassword()}>Forgot my Password</label>
            </div>
        </div>
    );
}

export default LoginWindow;