import React, { useEffect } from 'react'
import LoginInput from '../components/LoginInput';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'rgba(255, 255, 157, 1)';
    return () => {
      document.body.style.backgroundColor = ''; // Clean up
    };
  }, []);

  const [response, setResponse] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setResponse('רגע...');
    try {
      const res = await fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (res.status === 200) {
        navigate('/home');
      }
      else {
        setResponse("שם המשתמש או הסיסמה שגויים");
      }
    } catch (err: any) {
      setResponse('שגיאה בהתחברות לשרת, אנא נסה שוב במועד מאוחר יותר');
      console.error('Failed to contact backend:', err);
    }
  };

  return (
    <>
      <img src="./src/assets/caveret-logo.svg" alt="caveret-logo" className='caveret-logo' />
      <h1 className='login-title'>כניסה לחשבון</h1>
      <div className='login-input-container'>
        <p>עוד אין לכם חשבון? <Link to="/signup">להרשמה!</Link></p>
        <LoginInput onLogin={handleLogin} buttonText='נו תן כבר להיכנס' />
      </div>
      <p className='login-response'>{response}</p>
    </>
  )
}

export default LoginPage