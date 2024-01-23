import { useState } from "react"

import { useBaseUrl } from "../../utils/providers/urlprovider";
import { signup, login } from "../../services/user/admin";
import { studentLogin } from "../../services/student/student";
import { CustomError } from '../../utils/errors';

import Message from "../Message";


const StudentLogin = ({handleHovering, handleLoginState}) => {
    const [username, setUsername] = useState("");
    const [groupName, setGroupName] = useState("");

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const clearMessage = () => {
        setIsError(false);
        setMessage("");
    }
    const baseUrl = useBaseUrl();

    const handleUsername = (e) => setUsername(e.target.value);
    const handleGroupName = (e) => setGroupName(e.target.value);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await studentLogin(baseUrl, groupName, username);
            handleLoginState();
        } catch (error) {
            setIsError(true);
            setMessage(error.message);
        }
    };

    return (
        <div className="flex-center-column full-container"  onMouseLeave={handleHovering}>
            <h1 className="header">Member</h1>
            <Message message={message} isError={isError} clearMessage={clearMessage}/>
            <form className="full-width flex-center-column" onSubmit={handleLogin}>
                <input placeholder="Username" 
                type="text"
                value={username}
                onChange={handleUsername}/>

                <input placeholder="Group name" 
                type="text"
                value={groupName}
                onChange={handleGroupName}/>

                <button className={`login-button secondary-color`} 
                type="submit"
                onClick={handleLogin}>
                    Login
                </button>
            </form>
        </div>
    );
}


const AdminLogin = ({handleHovering, handleSignup, loginMessage, handleLoginState}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState(loginMessage);

    const clearMessage = () => {
        setIsError(false);
        setMessage("");
    }
    const baseURL = useBaseUrl();

    const handleUsername = (e) => setUsername(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password, baseURL);
            setIsError(false);
            handleLoginState();
        
        } catch (error) {
            setIsError(true);
            setMessage(error.message || "An unexpected error occurred.");
        }
        
    };

    return (
        <div className="flex-center-column full-container form-container"  onMouseLeave={handleHovering}>
            <h1 className="header">Admin</h1>
            <Message message={message} isError={isError} clearMessage={clearMessage}/>
            <form className="full-width flex-center-column" onSubmit={handleLogin}>
                <input placeholder="Username" 
                type="text"
                value={username}
                onChange={handleUsername}/>

                <input placeholder="Password" 
                type="password"
                value={password}
                onChange={handlePassword}/>

                <button className={`login-button primary-color`} 
                type="submit"
                onClick={handleLogin}>
                    Login
                </button>
            </form>
            <button className="link" onClick={handleSignup}>
                Don't have an account?
            </button>
        </div>
    );
}


const AdminSignup = ({handleHovering, handleSignup, setNewMessage}) => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    
    const clearMessage = () => {
        setIsError(false);
        setMessage("");
    }
    const baseURL = useBaseUrl();

    const handleEmail = (e) => setEmail(e.target.value);
    const handleUsername = (e) => setUsername(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleRepassword = (e) => setRepassword(e.target.value);

    const handleSignupForm = async (e) => {
        e.preventDefault();
        if (password !== repassword) {
            setIsError(true);
            setMessage("Passwords must match!");
        } else {
            try {
                await signup(username, email, password, baseURL);
                setNewMessage("Welcome, you can now login!");
                handleSignup(true);
            } catch (error) {
                setIsError(true);
                if (error instanceof CustomError) {
                    setMessage(error.message);
                } else {
                    setMessage("An unexpected error occurred.");
                }
            }
        }
    };

    return (
        <div className="flex-center-column full-container form-container"  onMouseLeave={handleHovering}>
            <h1 className="header">Admin</h1>
            <Message message={message} isError={isError} clearMessage={clearMessage}/>
            <form className="full-width flex-center-column" onSubmit={handleSignupForm}>
                <input placeholder="Email" 
                type="email"
                value={email}
                onChange={handleEmail}/>

                <input placeholder="Username" 
                type="text"
                value={username}
                onChange={handleUsername}/>

                <input placeholder="Password" 
                type="password"
                value={password}
                onChange={handlePassword}/>

                <input placeholder="Password" 
                type="password"
                value={repassword}
                onChange={handleRepassword}/>
                
                <button className={`login-button primary-color`} 
                type="submit">
                    Signup
                </button>
            </form>
            <button className="link" onClick={handleSignup}>
                Already have an account?
            </button>
        </div>
    );
}


export { StudentLogin, AdminLogin, AdminSignup };
