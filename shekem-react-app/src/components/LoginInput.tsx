import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface LoginInputProps {
    onLogin: (username: string, password: string) => void;
    buttonText?: string
    usernamePlaceholder?: string
    passwordPlaceholder?: string
}



const LoginInput = ({ onLogin, buttonText = 'Login', usernamePlaceholder = '', passwordPlaceholder = '' }: LoginInputProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '300px', rowGap: '10px' }}>
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
                <Button
                    type="submit"
                    onClick={() => onLogin(username, password)}
                    sx={{ bgcolor: '#ff198c', color: 'white', height: '50px' }}
                >
                    {buttonText}
                </Button>
            </Box>
        </>
    )
}

export default LoginInput