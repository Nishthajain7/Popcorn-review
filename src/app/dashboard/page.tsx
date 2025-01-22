'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.status === 'success') {
        setUser(data.username);  // Set the logged-in username
      } else {
        router.push('/');  // Redirect to login page if not logged in
      }
    };
    fetchUserData();
  }, [router]);

  return (
    <div>
      {user ? (
        <h1>Welcome, {user}!</h1>  // Show logged-in state
      ) : (
        <p>Loading...</p>  // Show loading message if user data is being fetched
      )}
    </div>
  );
};

export default Dashboard;
