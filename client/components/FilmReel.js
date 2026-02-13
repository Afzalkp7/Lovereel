import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Head from 'next/head';
import Slideshow from './Slideshow';

export default function FilmReel({ openModal, isPaid, onPaymentSuccess }) {
    const [films, setFilms] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:5000/films?userId=${userId}`)
            .then(res => {
                setFilms(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching films:", err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!confirm("Delete this memory?")) return;

        try {
            await axios.delete(`http://localhost:5000/films/${id}`);
            setFilms(prev => prev.filter(film => film._id !== id));
        } catch (err) {
            console.error("Failed to delete film:", err);
            alert("Failed to delete film");
        }
    };

    const stopReel = () => {
        setIsPlaying(false);
    };

    const startReel = () => {
        const username = localStorage.getItem("username");
        if (username) {
            window.location.href = `/${username}`;
        } else {
            alert("Username not found. Please re-login.");
        }
    };

    const handleLogout = () => {
        if (confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            router.push("/landing");
        }
    };

    const handleShare = () => {
        const username = localStorage.getItem("username");
        if (!username) {
            alert("Please log in again to enable sharing.");
            return;
        }
        const url = `${window.location.origin}/${username}`;
        navigator.clipboard.writeText(url).then(() => {
            alert(`Link copied: ${url}\nShare it with your valentine ❤️`);
        }).catch(err => {
            console.error("Failed to copy:", err);
            alert("Failed to copy link.");
        });
    };

    const handleUnlock = async () => {
        try {
            const { data: order } = await axios.post("http://localhost:5000/payment/create-order");

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Lovereel",
                description: "Unlock your Reel",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const userId = localStorage.getItem("userId");
                        const verifyRes = await axios.post("http://localhost:5000/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: userId
                        });

                        if (verifyRes.data.success) {
                            alert("Payment Successful! Reel Unlocked ❤️");
                            onPaymentSuccess();
                        }
                    } catch (err) {
                        alert("Payment Verification Failed");
                        console.error(err);
                    }
                },
                theme: {
                    color: "#be123c"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment Start Error:", err);
            alert("Could not start payment.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden relative">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
            </Head>

            <style jsx>{`
                /* ... specific styles for gallery if needed ... */
            `}</style>

            <div className="absolute inset-0 bg-stone-900 opacity-80 pointer-events-none"></div>

            <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 font-serif tracking-widest uppercase z-10 text-stone-300 drop-shadow-lg text-center px-4">Lovereel</h1>

            <div className="absolute top-6 right-6 z-50 flex gap-4">
                {isPaid ? (
                    <button
                        onClick={handleShare}
                        className="text-stone-500 hover:text-pink-500 transition-colors"
                        title="Share Reel"
                    >
                        🔗
                    </button>
                ) : (
                    <button
                        onClick={handleUnlock}
                        className="bg-rose-700 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-serif italic shadow-lg animate-pulse"
                        title="Unlock Reel"
                    >
                        Unlock (₹19)
                    </button>
                )}

                <button
                    onClick={handleLogout}
                    className="text-stone-500 hover:text-rose-500 transition-colors font-serif italic text-lg"
                    title="Logout"
                >
                    Logout
                </button>
            </div>


            {films.length > 0 && (
                <button
                    onClick={startReel}
                    className="mb-8 z-20 bg-stone-800 hover:bg-stone-700 text-stone-200 font-serif italic px-6 py-2 rounded-full border border-stone-600 transition-all shadow-lg hover:scale-105"
                >
                    Start Reel 📽️
                </button>
            )}

            {!isPlaying && (
                <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
                    <button
                        onClick={openModal}
                        className={`${films.length === 0 ? "bg-red-900 px-6 py-2 md:px-8 md:py-3 text-lg md:text-xl rounded-full" : "bg-stone-800 p-4 rounded-full text-2xl w-16 h-16 flex items-center justify-center"} text-white font-serif italic shadow-2xl border-2 border-red-700 hover:scale-105 transition-transform hover:bg-red-800 z-50`}
                    >
                        {films.length === 0 ? "+ Make Reel" : "➕"}
                    </button>
                </div>
            )}

            <div className="w-full overflow-x-auto pb-8 z-10 no-scrollbar">
                <div className="inline-flex items-center space-x-0 bg-black border-y-[8px] md:border-y-[12px] border-dashed border-stone-800 py-4 px-4 md:px-12 min-w-full">
                    {films.length === 0 && (
                        <div className="w-full text-center text-stone-500 italic p-8 text-sm md:text-base">No films yet. Add one to start your reel!</div>
                    )}
                    {films.map((film, index) => (
                        <div key={film._id} className="flex-shrink-0 relative group">
                            <div
                                onClick={() => { setCurrentIndex(index); }}
                                className="w-48 h-36 md:w-64 md:h-48 bg-black border-2 md:border-4 border-black outline outline-1 md:outline-2 outline-stone-700 relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:z-20 cursor-pointer"
                            >
                                <img
                                    src={film.imageUrl}
                                    alt="Memory"
                                    className="w-full h-full object-cover sepia-[.3] contrast-125 hover:sepia-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                                    <p className="text-stone-200 text-[10px] md:text-xs font-serif italic text-center w-full mb-1">"{film.quote}"</p>
                                    <button
                                        onClick={(e) => handleDelete(film._id, e)}
                                        className="self-center bg-red-900/80 text-white text-[10px] px-2 py-1 rounded hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* INLINE PLAYBACK REMOVED/HIDDEN AS WE REDIRECT NOW */}
            {isPlaying && (
                <Slideshow films={films} onClose={stopReel} />
            )}
        </div>
    );
}
