import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Slideshow from '../components/Slideshow';
import { useScreenProtection } from '../hooks/useScreenProtection';

export default function UserReel() {
    const router = useRouter();
    const { username } = router.query;
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [showSlideshow, setShowSlideshow] = useState(false);

    const [isOwner, setIsOwner] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    useScreenProtection();

    useEffect(() => {
        if (!username) return;

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        axios.get(`/api/films/user/${username}`, { headers })
            .then(res => {
                // Support both array (old/direct) and object (new with metadata) responses
                if (Array.isArray(res.data)) {
                    setFilms(res.data);
                } else {
                    setFilms(res.data.films || []);
                    setIsOwner(res.data.isOwner);
                    setIsPaid(res.data.isPaid);
                }
                setLoading(false);
            })
            .catch(err => {
                if (err.response && err.response.status === 403) {
                    console.warn("Reel is locked (Expected for unpaid user)");
                    setIsLocked(true);
                    setError("This reel is waiting to be unlocked by the creator. 🔒");
                } else {
                    console.error("Error fetching films:", err);
                    setError("User not found or no films available.");
                }
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

    if (isLocked) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center flex-col p-8 text-center">
            <h1 className="text-6xl mb-6">🔒</h1>
            <h2 className="text-3xl font-serif text-rose-500 mb-4">Locked Memory</h2>
            <p className="text-stone-300 text-lg max-w-md">
                This Love Reel hasn't been unlocked by the creator yet.
                <br />
                <span className="text-sm text-stone-500 mt-4 block">Tell them to complete the setup! ❤️</span>
            </p>
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

                    {isOwner && !isPaid && (
                        <div className="absolute top-0 left-0 w-full bg-yellow-600/90 text-black font-bold text-center py-2 z-50">
                            🚧 PREVIEW MODE: Only you can see this. Pay to unlock sharing! 🚧
                        </div>
                    )}

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
