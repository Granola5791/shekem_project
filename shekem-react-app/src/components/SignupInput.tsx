import React, { useState } from 'react'
import './SignupInput.css';

interface LoginInputProps {
    onSignup: (username: string, password: string, repeatedPassword: string) => void;
    buttonText?: string
    usernamePlaceholder?: string
    passwordPlaceholder?: string
    rePasswordPlaceholder?: string
}



const SignupInput = ({ onSignup, buttonText = 'Signup', usernamePlaceholder = 'Enter your username', passwordPlaceholder = 'Enter your password', rePasswordPlaceholder = 'Repeat your password' }: LoginInputProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    return (
        <>
            <div className="signup-input-container">
                <input className="username-input" type="text" placeholder={usernamePlaceholder} onChange={(e) => setUsername(e.target.value)} />
                <input className="password-input" type="password" placeholder={passwordPlaceholder} onChange={(e) => setPassword(e.target.value)} />
                <input className="password-input" type="password" placeholder={rePasswordPlaceholder} onChange={(e) => setRepeatedPassword(e.target.value)} />
                <button className="signup-button" type="submit" onClick={() => onSignup(username, password, repeatedPassword)}>{buttonText}</button>
            </div>
        </>
    )
}

export default SignupInput