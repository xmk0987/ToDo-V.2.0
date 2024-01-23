import { useState } from 'react'

import '../../styles/login/login.css'

import {StudentLogin, AdminLogin, AdminSignup} from './loginForms';
import { useNavigate } from 'react-router-dom';

const ChooseLoginButton = ({name, handleHovering, admin=false}) => {
    const [isAdmin] = useState(admin);

    return (
        <div className={`choose-login-button 
            flex-center ${isAdmin ? 'primary-color' 
            : 'secondary-color'}`}
            onMouseEnter={handleHovering}>
                <h1 className='header'>{name}</h1>
        </div>
    );
}

const LeftContainer = ({handleLoginState}) => {
    const [isHovering, setIsHovering] = useState(false);


    const handleHovering = () => {
        setIsHovering(!isHovering);

    }

    return (
        <div className='half-login-container left-login-container flex-center relative'>
            { !isHovering ?
                <ChooseLoginButton name="Member" handleHovering={handleHovering}/> 
                :
                <StudentLogin handleHovering={handleHovering}
                 handleLoginState={handleLoginState}/>
            }
        </div>
    )
}

const RightContainer = ({handleLoginState}) => {
    const [isHovering, setIsHovering] = useState(false);
    const [signup, setSignup] = useState(false);
    const [loginMessage, setMessage] = useState("");

    const handleHovering = () => {
        setIsHovering(!isHovering);
    }

    const setNewMessage = (message) => {setMessage(message)}

    const handleSignup = () => {
        setSignup(!signup);
    }

    return (
        <div className='half-login-container right-login-container relative'>
            { !isHovering ?
                <ChooseLoginButton name="Admin" handleHovering={handleHovering} admin={true}/> 
                :
                !signup ? (<AdminLogin handleHovering={handleHovering} 
                                        handleSignup={handleSignup} 
                                        loginMessage={loginMessage} 
                                        handleLoginState={handleLoginState}/>)
                :
                (<AdminSignup handleHovering={handleHovering} handleSignup={handleSignup} setNewMessage={setNewMessage}/>)
            }
        </div>
    )
}

const ChooseLogin = () => {
    const navigate = useNavigate();

    const handleLoginState = () => {
        navigate("/");
    }

    return (
        <div className='full-container login-container'>
            <LeftContainer handleLoginState={handleLoginState}/>
            <RightContainer handleLoginState={handleLoginState}/>
        </div>
    )

}

export default ChooseLogin