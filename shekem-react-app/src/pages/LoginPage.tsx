import React from 'react'
import LoginInput from '../components/LoginInput';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
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
      setResponse('שגיאה בהתחברות לשרת');
      console.error('Failed to contact backend:', err);
    }
  };

  return (
    <>
      <img src="./src/assets/caveret-logo.svg" alt="caveret-logo" className='caveret-logo' />
      <h1 className='login-title'>כניסה לחשבון</h1>
      <div className='login-input-container'><LoginInput onLogin={handleLogin} buttonText='נו תן כבר להיכנס'/></div>
      <p className='login-response'>{response}</p>
    </>
  )
}

export default LoginPage