import React, { useEffect } from 'react'
import SignupInput from '../components/SignupInput.tsx'
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const SignupPage = () => {
    useEffect(() => {
        document.body.style.backgroundColor = 'rgba(222, 255, 140, 1)';
        return () => {
            document.body.style.backgroundColor = ''; // Clean up
        };
    }, []);

    const [response, setResponse] = React.useState<React.ReactNode>('');

    // TODO: put string constants in a yaml file
    const handleSignup = async (username: string, password: string, repeatedPassword: string) => {
        setResponse('רגע...');
        if (password !== repeatedPassword) {
            setResponse('הסיסמות לא תואמות');
            return;
        }
        try {
            const res = await fetch('http://localhost:8081/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            switch (res.status) {
                case 201:
                    setResponse(<span>ההרשמה בוצעה בהצלחה, אנא חזור <Link to="/login">לעמוד ההתחברות</Link></span>);
                    break;
                case 400:
                    setResponse('שם המשתמש או הסיסמה לא תקינים');
                    break;
                case 409:
                    setResponse('שם המשתמש כבר קיים');
                    break;
                default:
                    setResponse('שגיאה התרחשה, אנא נסה שוב במועד מאוחר יותר');
            }
        } catch (err) {
            setResponse('שגיאה בהתחברות לשרת, אנא נסה שוב במועד מאוחר יותר');
        }
    }
    return (
        <>
            <img src="./src/assets/caveret-logo.svg" alt="caveret-logo" style={{ width: '350px' }} />
            <Typography variant="h4" align="center" sx={{ color: 'rgb(9, 191, 9)', fontWeight: 'bold' }}>הרשמה לחשבון</Typography>

            <Box sx={{
                margin: 'auto',
                width: '300px',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px',
                marginTop: '20px'
            }} >
                <Typography variant='body1'>כבר יש לכם חשבון? <Link to="/login">להתחברות!</Link></Typography>
                <Typography variant='body1' sx={{ lineHeight: '15px' }}><b>שימו לב:</b> שם המשתמש והסיסמה חייבים להיות באורך של 8–30 תווים, ויכולים להכיל רק תווים באנגלית, מספרים ותווים מיוחדים (!,@,#,$,%,^,&,*).</Typography>
                <SignupInput
                    onSignup={handleSignup}
                    usernamePlaceholder='הכנס שם משתמש'
                    passwordPlaceholder='הכנס סיסמה'
                    rePasswordPlaceholder='הכנס סיסמה שוב'
                />
            </Box>
            <Typography variant="body1" align="center" sx={{ color: 'red', marginTop: '20px' }}>
                {response}
            </Typography>
        </>
    )
}
export default SignupPage