'use client';
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import movies from "../../../../public/movies.json";
import Image from 'next/image';

const MovieDetails = () => {
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
    const [comments, setComments] = useState<{ username: string; content: string }[]>([]);
    const [newComment, setNewComment] = useState('');
    const { id } = useParams();
    const movie = movies.find((movie) => movie.id === parseInt(id as string, 10));
    if (!movie) return <div>Movie not found!</div>;

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch('http://localhost:5000/profile', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (data.status === 'success') {
                setUser(data);
            }
        };
        const fetchComments = async () => {
            const response = await fetch(`http://localhost:5000/api/movies/${id}/comments`, { method: 'GET' })
            if (!response.ok) {
                console.log('Error response:', response.statusText);
                return;
            }
            const data = await response.json();
            if (data.status === 'success') {
                setComments(data.comments);
            }
        };
        fetchUserData();
        fetchComments();
    }, [id]);

    const addComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await fetch(`http://localhost:5000//api/movies/${id}/comments`, { method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newComment }),
                credentials: 'include',
            });

            const data = await response.json();
            console.log('Movie ID:', id);
            console.log('Response:', data);

            if (response.ok && data.status === 'success') {
                setComments((prevComments) => [
                    ...prevComments,
                    { username: data.username, content: data.content },
                ]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Add comment failed:', error);
        }
    };

    const addToWishlist = async (e: React.FormEvent) => {
        try {
            const response = await fetch(`http://localhost:5000//api/movies/${id}/watchlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: movie.id, }),
                credentials: 'include',
            });

            const data = await response.json();
            console.log('Movie ID:', id);
            console.log('Response:', data);

            if (response.ok && data.status === 'success') {

            }
        } catch (error) {
            console.error('Add comment failed:', error);
        }
    }

    return (
        <div className="flex sm:flex-col md:flex-row lg:flex-row gap-6 p-6">
            <img src={movie.image} alt={movie.name} className="object-cover" />
            <div>
                <h1 className="text-4xl font-semibold pb-5">{movie.name}</h1>
                <p className="text-lg text-gray-700 pb-4"><strong>Release Year:</strong> {movie.year}</p>
                <p className="text-gray-600">{movie.description}</p>
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold pb-4">User Comments</h2>
                    {comments.length === 0 ? (
                        <p>No comments yet!</p>
                    ) : (
                        comments.map((comment, index) => (
                            <div key={index} className="border-b py-2">
                                <strong>{comment.username}</strong>
                                <p>{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={addComment} className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                        className="w-full p-2 border rounded-md"
                    />
                    <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded-md">
                        Post Comment
                    </button>
                </form>
                <button onClick={addToWishlist} className="mt-2 p-2 bg-yellow-500 text-white rounded-md">
                    Add To Wishlist
                </button>
            </div>

        </div>
    );
};

export default MovieDetails;
