'use client';
import TrueFocus from '../components/AnimatedText';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from 'next/image'
import movies from "../../public/movies.json"
import { FaBars } from "react-icons/fa6";
import { LiaCommentSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
import { FaClipboardList } from "react-icons/fa";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [FormOpen, setFormOpen] = useState(false);
  const [Registering, setRegistering] = useState(false);
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userata, setuserData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    whatsapp: "",
    dob: "",
    genres: "",
    comments: {}
  });

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleFormOpen = () => {
    setFormOpen(!FormOpen);
  };
  const toggleRegistering = () => {
    setRegistering(!Registering);
  };
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const route = Registering ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
      const response = await fetch(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: Registering
        ? JSON.stringify({
          name: userata.name,
          username: userata.username,
          email: userata.email,
          phone: userata.phone,
          whatsapp: userata.whatsapp,
          dob: userata.dob,
          genres: userata.genres,
          password: userata.password,
        })
        : JSON.stringify({username: userata.username, password: userata.password,}),
      
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (response.ok && data.status === 'success') {
        if (Registering) {
          alert('Registration successful! Please log in.');
          setRegistering(false);
        } else {
          setFormOpen(false);
          const loggedInStatus = localStorage.getItem("isLoggedIn");
          localStorage.setItem("isLoggedIn", "true");
          setIsLoggedIn(true);
        }
      } else {
        setIncorrectLogin(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIncorrectLogin(true);
    }
  };

  const logout = async () => {
    await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const setInput = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setuserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery)
  );

  return (
    <main>

      <div className="px-20 z-20 fixed flex h-28 gap-4 bg-[#e8daef] items-center w-full">
        {isLoggedIn && <button className="icon" onClick={toggleMenu}><FaBars /></button>}
        <input className="h-10 border-2 border-gray-300 rounded-full px-4 w-full" name="query" placeholder="Search for a movie" onChange={handleSearch}/>
        {isLoggedIn ? <button className="bg-slate-500 text-white px-6 py-2 rounded-3xl hover:bg-slate-800 active:scale-95" onClick={logout}>Logout</button> : <button className="bg-slate-500 text-white px-6 py-2 rounded-3xl hover:bg-slate-800 active:scale-95" onClick={toggleFormOpen}>Login</button>}
      </div>

      {FormOpen && !isLoggedIn && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-[30vw] relative">
          <button className="absolute top-2 right-6 text-4xl" onClick={toggleFormOpen}>×</button>
          <h2 className="text-2xl font-bold mb-4 w-max">{Registering ? "Register" : "Login"}</h2>

          <form method="POST" onSubmit={submit} className="form">
          {Registering && (
            <><input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" placeholder="Full Name" name="name" value={userata.name} onChange={setInput} />
            <input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" placeholder="E-mail" name="email" value={userata.email} onChange={setInput} />
            <input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" type="tel" placeholder="Phone Number" name="phone" value={userata.phone} onChange={setInput} />
            <input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" type="tel" placeholder="Whatsapp Number" name="whatsapp" value={userata.whatsapp} onChange={setInput} />
            <input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" type="date" placeholder="Date of Birth" name="dob" value={userata.dob} onChange={setInput} />
            <input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" placeholder="Your Favorite Genres" name="genres" value={userata.genres} onChange={setInput} />
            </>
            )}
            <input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" placeholder="Username" name="username" value={userata.username} onChange={setInput} />
            <input className="w-full mb-4 p-2 border-2 border-gray-300 rounded-lg" type="password" placeholder="Password" name="password" value={userata.password} onChange={setInput}/>
            {incorrectLogin && <p className="text-red-500 mb-4">Incorrect username or password</p>}
            <button className="bg-blue-500 text-white w-full py-2 rounded-full mt-4" type="submit">{Registering ? "Register" : "Login"}</button>
          </form>

          <div className="mt-4 text-center">
              <Link href="#">{Registering ? "Already have an account? " : "Do not have an account? "}<span className="text-blue-500 hover:underline" onClick={toggleRegistering}>{Registering ? "Login" : "Register"}</span></Link>
          </div>
        </div>
      </div>
      
      )}

      <div className={`optionsMenu ${menuOpen ? "open" : ""}`}>

        <Link href="profile" className="option">
          <div className="icon"><CgProfile /></div>
          Profile
        </Link>
        <Link href="watchlist" className="option">
          <div className="icon"><FaClipboardList /></div>
          <p>Watchlist</p>
        </Link>

      </div>

      <div className="absolute w-full top-[7rem] bottom-0 flex flex-col">
        <div className="pt-[8vh] pb-[5vh]"><TrueFocus
          sentence="Lights Camera Action"
          manualMode={false}
          blurAmount={5}
          borderColor="red"
          animationDuration={1}
          pauseBetweenAnimations={0.5}
        /></div>
        <p className="text-2xl text-center pb-[5vh] font-bold text-slate-600">Rate Movies, Write Reviews, And Create Personalized Watchlists.</p>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-[30px] px-20 transition-transform duration-200 ease-in-out text-center">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="m-auto w-fit flex flex-col items-center border-2 border-gray-300 rounded-[10px] p-[10px] bg-gray-100 transition-transform duration-200 ease-in-out hover:scale-105 text-center">
              <Link href={`/movieDetails/${movie.id}`}>
              <Image src={movie.image} alt={movie.name} width={200} height={300} className="rounded-[8px] object-fill" />
              <h2 className="pt-[0.8rem] text-[22px] font-bold my-[5px]">{movie.name}</h2>
              <p>Released: {movie.year}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}