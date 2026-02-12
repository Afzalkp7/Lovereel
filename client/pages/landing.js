import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function Landing() {
    const router = useRouter();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-rose-50 to-stone-100 relative overflow-hidden">
            <Head>
                <title>Love Reel - Turn Your Photos Into a Love Story</title>
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
            </Head>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes pulse-heart {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .animate-pulse-heart {
                    animation: pulse-heart 2s ease-in-out infinite;
                }
                .handwritten {
                    font-family: 'Great Vibes', cursive;
                }
                .serif {
                    font-family: 'Playfair Display', serif;
                }
                .sans {
                    font-family: 'Inter', sans-serif;
                }
                .glass-effect {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }
            `}</style>

            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-rose-400"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${1 + Math.random() * 2}rem`,
                            animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>

            {/* Cursor Glow Effect */}
            <div
                className="fixed w-96 h-96 rounded-full pointer-events-none opacity-30 blur-3xl transition-all duration-300"
                style={{
                    background: 'radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, transparent 70%)',
                    left: mousePosition.x - 192,
                    top: mousePosition.y - 192,
                }}
            />

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="handwritten text-4xl text-rose-600 drop-shadow-sm">
                    Love Reel
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/login")}
                        className="sans px-6 py-2 text-stone-700 hover:text-rose-600 transition-colors font-medium"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => router.push("/signup")}
                        className="sans px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                        Sign Up Free
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
                {/* Main Heading */}
                <div className="animate-fadeInUp" style={{ animationDelay: '0.1s', opacity: 0 }}>
                    <h1 className="text-7xl md:text-8xl mb-6">
                        <span className="text-stone-700 serif font-semibold">Turn Your </span>
                        <span className="handwritten text-rose-600 text-8xl md:text-9xl">Love</span>
                    </h1>
                    <h1 className="text-7xl md:text-8xl text-stone-700 serif font-semibold mb-8">
                        Into a Film Reel
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="animate-fadeInUp" style={{ animationDelay: '0.3s', opacity: 0 }}>
                    <p className="serif italic text-2xl md:text-3xl text-stone-600 mb-4 max-w-3xl mx-auto leading-relaxed">
                        Transform your cherished photos into a
                        <span className="handwritten text-rose-500 text-4xl mx-2 not-italic">romantic slideshow</span>
                    </p>
                    <p className="serif text-xl text-stone-500 mb-12 max-w-2xl mx-auto">
                        with beautiful quotes, music, and cinematic effects
                    </p>
                </div>

                {/* CTA Button */}
                <div className="animate-fadeInUp mb-16" style={{ animationDelay: '0.5s', opacity: 0 }}>
                    <button
                        onClick={() => router.push("/signup")}
                        className="sans group relative px-12 py-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <span className="flex items-center gap-3">
                            Create Your Love Reel
                            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                    </button>
                    <p className="sans text-sm text-stone-500 mt-4">
                        Free • No credit card required • Share as video or GIF
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 mt-20 animate-fadeInUp" style={{ animationDelay: '0.7s', opacity: 0 }}>
                    {[
                        {
                            icon: "📸",
                            title: "Upload Photos",
                            description: "Add your favorite memories together"
                        },
                        {
                            icon: "💝",
                            title: "Romantic Quotes",
                            description: "Beautiful love quotes overlay each photo"
                        },
                        {
                            icon: "🎬",
                            title: "Cinematic Magic",
                            description: "Vintage film reel with music & effects"
                        }
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="glass-effect p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 group"
                        >
                            <div className="text-5xl mb-4 animate-pulse-heart group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="serif text-xl font-semibold text-stone-800 mb-2">
                                {feature.title}
                            </h3>
                            <p className="sans text-stone-600 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Social Proof */}
                <div className="mt-20 animate-fadeInUp" style={{ animationDelay: '0.9s', opacity: 0 }}>
                    <div className="glass-effect inline-block px-8 py-4 rounded-full shadow-lg">
                        <p className="sans text-stone-700">
                            <span className="font-semibold text-rose-600">Perfect for:</span> Anniversaries • Proposals • Valentine's Day • Just Because ♥
                        </p>
                    </div>
                </div>
            </main>

            {/* Decorative Elements */}
            <div className="absolute bottom-10 left-10 text-9xl text-rose-200 opacity-50 animate-float pointer-events-none">
                ♥
            </div>
            <div className="absolute top-32 right-20 text-7xl text-pink-200 opacity-40 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
                ♥
            </div>
        </div>
    );
}
