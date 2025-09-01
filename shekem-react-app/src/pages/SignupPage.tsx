import React, { useEffect } from 'react'
import SignupInput from '../components/SignupInput.tsx'
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { HebrewConstants, BackendConstants } from '../utils/constants.ts';
import { FetchHebrewConstants, FetchBackendConstants } from '../utils/constants.ts';
import { useNavigation } from '../utils/navigation.ts';
import Container from '@mui/material/Container';


const SignupPage = () => {

    useEffect(() => {
        const fetchConstants = async () => {
            const hebrew = await FetchHebrewConstants();
            setHebrewConstants(hebrew);
            const backend = await FetchBackendConstants();
            setBackendConstants(backend);
        };
        fetchConstants();
    }, []);


    const [response, setResponse] = React.useState<React.ReactNode>('');
    const [hebrewConstants, setHebrewConstants] = React.useState<HebrewConstants | null>(null);
    const [backendConstants, setBackendConstants] = React.useState<BackendConstants | null>(null);
    const { goToLogin: GoToLogin } = useNavigation();

    
    const handleSignup = async (username: string, password: string, repeatedPassword: string) => {
        if (!hebrewConstants || !backendConstants) {
            return;
        }
        setResponse(hebrewConstants.wait_text);
        if (password !== repeatedPassword) {
            setResponse(hebrewConstants.user_errors.password_mismatch);
            return;
        }
        try {
            const res = await fetch(backendConstants.backend_address + backendConstants.signup_api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            switch (res.status) {
                case backendConstants.status_codes.created:
                    GoToLogin();
                    break;
                case backendConstants.status_codes.bad_request:
                    setResponse(hebrewConstants.user_errors.invalid_username_or_password);
                    break;
                case backendConstants.status_codes.conflict:
                    setResponse(hebrewConstants.user_errors.username_taken);
                    break;
                default:
                    setResponse(hebrewConstants.user_errors.generic_error);
            }
        } catch (err) {
            setResponse(hebrewConstants.user_errors.server_error);
            console.error(err);
        }
    }

    if (!hebrewConstants || !backendConstants) return <div>Loading...</div>;

    return (
        <Container maxWidth={false} sx={{ width: '100%', height: '100%', bgcolor: 'rgba(222, 255, 140, 1)' }}>
            <img src="./src/assets/caveret-logo.svg" alt="caveret-logo" style={{ width: '350px' }} />
            <Typography variant="h4" align="center" sx={{ color: 'rgb(9, 191, 9)', fontWeight: 'bold' }}>
                {hebrewConstants.signup_texts.signup_title}
            </Typography>

            <Box sx={{
                margin: 'auto',
                width: '300px',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                marginTop: '20px'
            }} >
                <Typography>
                    {hebrewConstants.signup_texts.login_link.text}
                    <Link to="/login">{hebrewConstants.signup_texts.login_link.link_text}</Link>
                </Typography>
                <Typography variant='body1' sx={{ lineHeight: '15px' }}>
                    <b>{hebrewConstants.signup_texts.input_requirements_msg.strong}</b>
                    {hebrewConstants.signup_texts.input_requirements_msg.text}
                </Typography>
                <SignupInput
                    onSignup={handleSignup}
                    usernamePlaceholder={hebrewConstants.signup_texts.username_placeholder}
                    passwordPlaceholder={hebrewConstants.signup_texts.password_placeholder}
                    rePasswordPlaceholder={hebrewConstants.signup_texts.re_password_placeholder}
                    buttonText={hebrewConstants.signup_texts.signup_button_text}
                />
            </Box>
            <Typography variant="body1" align="center" sx={{ color: 'red', marginTop: '20px' }}>
                {response}
            </Typography>
        </Container>
    )
}
export default SignupPage