export async function getServerSideProps({ req }) {
  const res = await fetch('http://localhost:3000/api/me', {
    headers: { cookie: req.headers.cookie || '' },
  });

  if (!res.ok) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const { user } = await res.json();

  return { props: { user } };
}

export default function Dashboard({ user }) {
  return <h1>Welcome {user.username}</h1>;
}