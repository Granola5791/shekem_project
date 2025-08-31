import React, { useEffect } from 'react'
import LoginInput from '../components/LoginInput';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import type { HebrewConstants, BackendConstants, GeneralConstants } from '../utils/constants';
import { FetchHebrewConstants, FetchBackendConstants, FetchGeneralConstants } from '../utils/constants';
import { isGenericOKResponse } from '../utils/http';
import { useNavigation } from '../utils/navigation';

const LoginPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'rgba(255, 255, 157, 1)';
        return () => {
            document.body.style.backgroundColor = ''; // Clean up
        };
    }, []);

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

    if (!hebrewConstants || !backendConstants || !generalConstants) {
        return <div>loading...</div>
    }

    const handleLogin = async (username: string, password: string) => {
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

    return (
        <>
            <img src="photos/caveret-logo.svg" alt="caveret-logo" className='caveret-logo' />
            <h1 className='login-title'>{hebrewConstants.login_texts.login_title}</h1>
            <div className='login-input-container'>
                <p>
                    {hebrewConstants.login_texts.signup_link.text}
                    <Link to="/signup">{hebrewConstants.login_texts.signup_link.link_text}</Link>
                </p>
                <LoginInput onLogin={handleLogin} buttonText={hebrewConstants.login_texts.login_button_text} />
            </div>
            <p className='login-response'>{response}</p>
        </>
    )
}

export default LoginPage