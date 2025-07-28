import React from 'react'

const HomePage = () => {
    const [response, setResponse] = React.useState('');
    const testUser = async () => {
        try {
            setResponse('waiting...');
            const res = await fetch('http://localhost:8081/api/test/user', {
                method: 'GET',
                credentials: 'include',
            });
            //check if unauthorized
            if (res.status === 401) {
                setResponse('Unauthorized');
            }
            else {
                setResponse('success');
            }
        } catch (err) {
            console.error('Failed to contact backend:', err);
            setResponse('Error contacting server');
        }
    }

    const testAdmin = async () => {
        try {
            setResponse('waiting...');
            const res = await fetch('http://localhost:8081/api/test/admin', {
                method: 'GET',
                credentials: 'include',
            });
            //check if unauthorized
            if (res.status === 401) {
                setResponse('Unauthorized');
            }
            else {
                setResponse('success');
            }
        } catch (err) {
            console.error('Failed to contact backend:', err);
            setResponse('Error contacting server');
        }
    }

    return (
        <>
            <div>HomePage</div>
            <button onClick={testUser}>testUser</button>
            <button onClick={testAdmin}>testAdmin</button>
            <p>{response}</p>
        </>
    )
}

export default HomePage