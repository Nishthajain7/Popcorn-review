'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import movies from "../../../public/movies.json";

const WatchList = () => {
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
  const [watchlist, setWatchlist] = useState<{ username: string; movie_id: number }[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<{ id: number; year: number; name: string; description: string; image: string }[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('http://localhost:5000/user', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.status === 'success') {
        setUser(data);
      }
    };

    const fetchMovies = async () => {
      const response = await fetch('http://localhost:5000/watchlist', { method: 'GET' });
      if (!response.ok) {
        console.log('Error response:', response.statusText);
        return;
      }
      const data = await response.json();

      if (data.status === 'success') {
        setWatchlist(data.movies);

        const watchlistMovieIds = data.movies.map((item: { movie_id: number }) => item.movie_id);
        const filtered = movies.filter((movie) => watchlistMovieIds.includes(movie.id));
        setFilteredMovies(filtered);
      } else {
        console.error('Failed to fetch watchlist:', data.message);
      }
    };

    fetchUserData();
    fetchMovies();
  }, []);

  if (!filteredMovies.length) {
    return <div>Your watchlist is empty!</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Watchlist</h1>
      <div className="flex flex-row gap-10 transition-transform duration-200 ease-in-out text-center">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="w-fit flex flex-col items-center border-2 border-gray-300 rounded-[10px] p-[10px] bg-gray-100 transition-transform duration-200 ease-in-out hover:scale-105 text-center">
              <Link href={`/movieDetails/${movie.id}`}>
              <img src={movie.image} alt={movie.name} width={200} height={300} className="rounded-[8px] object-fill" />
              <h2 className="pt-[0.8rem] text-[22px] font-bold my-[5px]">{movie.name}</h2>
              <p>Released: {movie.year}</p>
              </Link>
            </div>
          ))}
        </div>
    </div>
  );
};

export default WatchList;