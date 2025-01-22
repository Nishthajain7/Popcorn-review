'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./profile.module.css";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    status: string;
    name: string;
    username: string;
    email: string;
    phone: string;
    whatsapp: string;
    dob: string;
    genres: string;
    password: string;
  } | null>(null);  
  const router = useRouter();

  useEffect(() => {

    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    } else {
      router.push('/');
      return;
    }

    const fetchUserData = async () => {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.status === 'success') {
        setUser(data);
      } else {
        router.push('/');
      }
      setLoading(false);
    };
    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.main}>

      <div className={styles.details}>
        <div className={styles.container}>
          <h1>Account Details</h1>
          <div className={styles.content}>
            <p className={styles.keys}>Full Name</p>
            <p className={styles.values}>{user?.name}</p>
            <p className={styles.keys}>Username</p>
            <p className={styles.values}>{user?.username}</p>
          </div>
        </div>

        <div className={styles.container}>
          <h1>Contact Details</h1>
          <div className={styles.content}>
            <p className={styles.keys}>E-mail</p>
            <p className={styles.values}>{user?.email}</p>
            <p className={styles.keys}>Mobile Number</p>
            <p className={styles.values}>{user?.phone}</p>
            <p className={styles.keys}>Whatsapp Number</p>
            <p className={styles.values}>{user?.whatsapp}</p>
          </div>
        </div>

        <div className={styles.container}>
          <h1>Personal Details</h1>
          <div className={styles.content}>
            <p className={styles.keys}>Birthday</p>
            <p className={styles.values}>{user?.dob}</p>
            <p className={styles.keys}>Favourite Genres</p>
            <p className={styles.values}>{user?.genres}</p>
          </div>
        </div>
      </div>

    </main>
  )
}

export default ProfilePage