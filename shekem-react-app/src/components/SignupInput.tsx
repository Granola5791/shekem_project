import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '300px',
                borderRadius: '5px',
                columnGap: '10px',
                rowGap: '5px',
            }}>
                <TextField
                    type="text"
                    placeholder={usernamePlaceholder}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    type="password"
                    placeholder={passwordPlaceholder}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    type="password"
                    placeholder={rePasswordPlaceholder}
                    onChange={(e) => setRepeatedPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    onClick={() => onSignup(username, password, repeatedPassword)}
                    sx={{marginTop: '10px', backgroundColor: 'rgb(9, 191, 9)', color: 'white', height: '50px'}}
                >
                    {buttonText}
                </Button>
            </Box>
        </>
    )
}

export default SignupInput