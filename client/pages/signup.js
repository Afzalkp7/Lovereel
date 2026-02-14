import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("/api/auth/signup", { name, email, password });
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                localStorage.setItem("username", res.data.user.username);
                // Optional: Store user info if needed
                router.push("/");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            // Check specific axios error structure
            if (err.message === "Network Error") {
                setError("Server is offline or unreachable. Check terminal!");
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || "Something went wrong (Unknown Error)");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
            <Head>
                <title>Love Reel - Join Us</title>
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
            </Head>

            {/* Back to Home */}
            <Link href="/landing" className="absolute top-6 left-6 text-stone-400 hover:text-white transition-colors z-20 flex items-center gap-2">
                <span>←</span> Back to Home
            </Link>

            {/* Background Animations (Same as Login) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900 via-black to-black animate-pulse-slow"></div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-pink-500/20 text-4xl animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${10 + Math.random() * 10}s`,
                            fontSize: `${1 + Math.random() * 2}rem`
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }
            `}</style>

            <div className="glass-card p-6 md:p-12 rounded-2xl w-full max-w-sm md:max-w-md mx-4 text-center relative z-10 transition-transform duration-300">
                <h1 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-3xl md:text-5xl text-white mb-2 drop-shadow-lg">
                    Start Your Story
                </h1>
                <p className="text-stone-400 font-serif italic mb-6 md:mb-8 text-xs md:text-base">
                    Create a reel for your special one.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full bg-black/30 border border-stone-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif placeholder-stone-600"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full bg-black/30 border border-stone-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif placeholder-stone-600"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full bg-black/30 border border-stone-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif placeholder-stone-600"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-rose-800 to-red-900 hover:from-rose-700 hover:to-red-800 text-white font-serif italic py-3 rounded-lg shadow-lg hover:shadow-rose-900/50 transition-all transform hover:scale-[1.02] active:scale-95 border border-red-700/50 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up 💖"}
                    </button>

                    {error && (
                        <p className="text-red-400 text-sm font-serif italic animate-pulse">
                            {error}
                        </p>
                    )}
                </form>

                <p className="mt-6 text-stone-500 text-sm">
                    Already have an account? <Link href="/login" className="text-rose-400 hover:text-rose-300 underline transition-colors">Login here</Link>
                </p>
            </div>
        </div>
    );
}
