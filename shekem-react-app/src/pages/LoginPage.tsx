import React, { useEffect } from 'react'
import LoginInput from '../components/LoginInput';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants';
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants } from '../utils/constants';
import { isGenericOKResponse } from '../utils/http';
import { useNavigation } from '../utils/navigation';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const LoginPage = () => {

    useEffect(() => {
        const fetchConstants = async () => {
            const hebrew = await FetchHebrewConstants();
            setHebrewConstants(hebrew);
            const backend = await FetchBackendConstants();
            setBackendConstants(backend);
            const general = await FetchGeneralConstants();
            setGeneralConstants(general);
        };
        fetchConstants();
    })

    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const [generalConstants, setGeneralConstants] = React.useState<GeneralConstants | null>(null);
    const [response, setResponse] = React.useState('');
    const { goToHome: GoToHome } = useNavigation();

    const handleLogin = async (username: string, password: string) => {
        if (!hebrewConstants || !backendConstants) {
            return;
        }
        setResponse(hebrewConstants.wait_text);
        try {
            const res = await fetch(backendConstants.backend_address + backendConstants.login_api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });


            if (isGenericOKResponse(res)) {
                GoToHome();
            }
            else {
                setResponse(hebrewConstants.user_errors.invalid_username_or_password);
            }
        } catch (err: any) {
            setResponse(hebrewConstants.user_errors.server_error);
            console.error(err);
        }
    };

    if (!hebrewConstants || !backendConstants || !generalConstants) {
        return <div>loading...</div>
    }

    return (
        <Container maxWidth={false} sx={{ width: '100%', height: '100%', bgcolor: 'rgba(255, 255, 157, 1)' }}>
            <img src="photos/caveret-logo.svg" alt="caveret-logo" style={{ width: '350px' }} />
            <Typography variant="h4" fontWeight={"bold"} textAlign={"center"} sx={{ color: '#ff198c' }}>
                {hebrewConstants.login_texts.login_title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Typography variant="body1" sx={{ marginY: '15px' }}>
                    {hebrewConstants.login_texts.signup_link.text}
                    <Link to="/signup">{hebrewConstants.login_texts.signup_link.link_text}</Link>
                </Typography>
                <LoginInput onLogin={handleLogin} buttonText={hebrewConstants.login_texts.login_button_text} />
            </Box>
            <Typography variant="body1" textAlign={"center"} color='red'>
                {response}
            </Typography>
        </Container>
    )
}

export default LoginPage