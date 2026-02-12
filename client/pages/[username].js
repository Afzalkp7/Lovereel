import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Slideshow from '../components/Slideshow';

export default function UserReel() {
    const router = useRouter();
    const { username } = router.query;
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSlideshow, setShowSlideshow] = useState(false);

    useEffect(() => {
        if (!username) return;

        axios.get(`http://localhost:5000/films/user/${username}`)
            .then(res => {
                setFilms(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching films:", err);
                setError("User not found or no films available.");
                setLoading(false);
            });
    }, [username]);

    const handleStart = () => {
        setShowSlideshow(true);
    };

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="animate-pulse">Loading surprise...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col">
            <h1 className="text-2xl text-red-500 mb-4">💔</h1>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative font-sans">
            <Head>
                <title>{username ? `${username}'s Love Reel` : "Love Reel"}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
            </Head>

            {!showSlideshow ? (
                <div className="flex flex-col items-center justify-center min-h-screen z-10 relative">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-black to-black"></div>

                    <div className="z-10 text-center p-8">
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 text-rose-500 font-[Great Vibes] drop-shadow-lg animate-pulse">
                            A Special Gift
                        </h1>
                        <p className="text-stone-300 mb-12 text-lg italic">
                            {username ? `For ${username}'s Valentine` : "For you"}
                        </p>

                        <button
                            onClick={handleStart}
                            className="bg-rose-700 hover:bg-rose-600 text-white px-8 py-4 rounded-full text-xl font-serif italic shadow-2xl hover:scale-105 transition-all animate-bounce"
                        >
                            Yes, Show Me! 🎁
                        </button>
                    </div>
                </div>
            ) : (
                <Slideshow films={films} onClose={() => setShowSlideshow(false)} isViewOnly={true} />
            )}
        </div>
    );
}
