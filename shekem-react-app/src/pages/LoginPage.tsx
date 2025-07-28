import React from 'react'
import LoginInput from '../components/LoginInput';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [response, setResponse] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    setResponse('waiting...');
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
        const text = await res.text();
        setResponse(text);
      }
    } catch (err: any) {
      setResponse('Error contacting server');
      console.error('Failed to contact backend:', err);
    }
  };

  return (
    <>
      <div><LoginInput onLogin={handleLogin} /></div>
      <p>{response}</p>
    </>
  )
}

export default LoginPage