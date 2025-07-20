import React, { useState } from 'react'
import './LoginInput.css';

interface LoginInputProps {
    onLogin: (username: string, password: string) => void;
}



const LoginInput = ({ onLogin }: LoginInputProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <>
            <div className="login-input-container">
                <input className="username-input" type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
                <input className="password-input" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <button className="login-button" type="submit" onClick={() => onLogin(username, password)}>Login</button>
            </div>
        </>
    )
}

export default LoginInput