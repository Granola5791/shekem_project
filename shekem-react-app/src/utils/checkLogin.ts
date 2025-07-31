export default async function HomeLoader() {
  const res = await fetch('http://localhost:8081/api/check_login', {
    method: 'GET',
    credentials: 'include'
  });
  if (res.status === 401) {
    throw new Response('Unauthorized', {
      status: 302,
      headers: { Location: '/login' },
    });
  }
  else {
    console.log('Authorized');
  }

  return null;
}