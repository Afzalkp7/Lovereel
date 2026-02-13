import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const res = await axios.post("/api/auth/login", { email, password });
            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);
                localStorage.setItem("username", res.data.user.username);
                // Optional: Store user info
                router.push("/");
            }
        } catch (err) {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
            <Head>
                <title>Love Reel - Login</title>
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
            </Head>

            {/* Back to Home */}
            <Link href="/landing" className="absolute top-6 left-6 text-stone-400 hover:text-white transition-colors z-20 flex items-center gap-2">
                <span>←</span> Back to Home
            </Link>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900 via-black to-black animate-pulse-slow"></div>

            {/* Floating Hearts */}
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
                .shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes shake {
                    10%, 90% { transform: translate3d(-1px, 0, 0); }
                    20%, 80% { transform: translate3d(2px, 0, 0); }
                    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                    40%, 60% { transform: translate3d(4px, 0, 0); }
                }
            `}</style>

            <div className={`glass-card p-8 md:p-12 rounded-2xl w-full max-w-md mx-4 text-center relative z-10 transition-transform duration-300 ${shake ? "shake border-red-500/50" : ""}`}>
                <h1 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-5xl md:text-6xl text-white mb-2 drop-shadow-lg">
                    Love Reel
                </h1>
                <p className="text-stone-400 font-serif italic mb-8 text-sm md:text-base">
                    Login to view your story.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(false); }}
                            placeholder="Email Address"
                            className="w-full bg-black/30 border border-stone-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif placeholder-stone-600"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            placeholder="Password"
                            className="w-full bg-black/30 border border-stone-600 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-serif placeholder-stone-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-rose-800 to-red-900 hover:from-rose-700 hover:to-red-800 text-white font-serif italic py-3 rounded-lg shadow-lg hover:shadow-rose-900/50 transition-all transform hover:scale-[1.02] active:scale-95 border border-red-700/50 disabled:opacity-50"
                    >
                        {loading ? "Unlocking..." : "Login 💖"}
                    </button>

                    {error && (
                        <p className="text-red-400 text-sm font-serif italic animate-pulse">
                            Invalid email or password.
                        </p>
                    )}
                </form>

                <p className="mt-8 text-stone-500 text-sm">
                    Don't have an account? <Link href="/signup" className="text-rose-400 hover:text-rose-300 underline transition-colors">Sign up free</Link>
                </p>
            </div>
        </div>
    );
}
