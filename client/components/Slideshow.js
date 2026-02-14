import { useEffect, useState, useRef, useMemo } from "react";
import Head from 'next/head';

export default function Slideshow({ films, onClose }) {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [showEnding, setShowEnding] = useState(false);
    const [proposalStatus, setProposalStatus] = useState(null);
    const [isUserPaused, setIsUserPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const scrollContainerRef = useRef(null);
    const activeIndexRef = useRef(0);
    const musicRef = useRef(null);
    const timerRef = useRef(null);
    const lastTapRef = useRef(0);

    // Keep ref in sync
    useEffect(() => {
        activeIndexRef.current = activeSlideIndex;
    }, [activeSlideIndex]);

    // Helper: Smooth Scroll
    const scrollToSlide = (index) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const track = container.firstElementChild;
        if (!track || !track.children[index]) return;

        const item = track.children[index];
        const center = item.offsetLeft + (item.offsetWidth / 2) - (container.clientWidth / 2);

        const start = container.scrollLeft;
        const change = center - start;
        const duration = 1000;
        const startTime = performance.now();

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            let progress = elapsed / duration;
            if (progress > 1) progress = 1;

            const ease = progress < 0.5
                ? 2 * progress * progress
                : -1 + (4 - 2 * progress) * progress;

            container.scrollLeft = start + change * ease;

            if (progress < 1) requestAnimationFrame(animateScroll);
        };
        requestAnimationFrame(animateScroll);
    };

    // Effect: Handle Active Slide Change (Visuals)
    useEffect(() => {
        scrollToSlide(activeSlideIndex);
    }, [activeSlideIndex]);

    // Effect: Auto-Advance Timer
    useEffect(() => {
        if (isUserPaused || showEnding) return;

        timerRef.current = setTimeout(() => {
            if (activeSlideIndex < films.length - 1) {
                setActiveSlideIndex(prev => prev + 1);
            } else {
                setShowEnding(true);
            }
        }, 6000);

        return () => clearTimeout(timerRef.current);
    }, [activeSlideIndex, isUserPaused, showEnding, films.length]);

    const handleTap = (e) => {
        if (showEnding) return;

        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        if (timeSinceLastTap < 300) {
            // Double Tap Detected
            const screenWidth = window.innerWidth;
            const clickX = e.clientX;

            if (clickX > screenWidth / 2) {
                // Next
                if (activeSlideIndex < films.length - 1) {
                    setActiveSlideIndex(prev => prev + 1);
                } else {
                    setShowEnding(true);
                }
            } else {
                // Previous
                if (activeSlideIndex > 0) {
                    setActiveSlideIndex(prev => prev - 1);
                }
            }
            // Reset pausing state to ensure smooth flow if desired, or keep user preference
            // setIsUserPaused(false); // Uncomment to auto-resume on skip
        } else {
            // Single Tap: Toggle Pause
            setIsUserPaused(!isUserPaused);
        }

        lastTapRef.current = now;
    };

    // Initial Scroll Setup
    useEffect(() => {
        // Give a small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            const container = scrollContainerRef.current;
            if (container && container.firstElementChild && container.firstElementChild.children.length > 0) {
                const item = container.firstElementChild.children[0];
                if (item) {
                    const center = item.offsetLeft + (item.offsetWidth / 2) - (container.clientWidth / 2);
                    container.scrollLeft = center;
                }
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [films.length]);

    // Music Control
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = 0.5;
            const playPromise = musicRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Auto-play was prevented:", error);
                });
            }
        }

        return () => {
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current.currentTime = 0;
            }
        };
    }, []);

    // Pause/Play music on user interaction
    useEffect(() => {
        if (musicRef.current) {
            if (isUserPaused) {
                musicRef.current.pause();
            } else {
                musicRef.current.play().catch(() => { });
            }
        }
    }, [isUserPaused]);




    const handleYes = (e) => {
        e.stopPropagation();
        setProposalStatus('yes');
    };

    const handleNo = (e) => {
        e.stopPropagation();
        e.target.innerText = "Try 'Yes' 😉";
        e.target.style.transform = `translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px)`;
    };

    const replayReel = () => {
        setIsUserPaused(false);
        setActiveSlideIndex(0);
        setShowEnding(false);
        setProposalStatus(null);

        // Use a timeout to allow the DOM to update (removing ending screen) before scrolling
        setTimeout(() => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                // Force scroll to start immediately
                container.scrollLeft = 0;

                const item = container.firstElementChild?.children[0];
                if (item) {
                    const center = item.offsetLeft + (item.offsetWidth / 2) - (container.clientWidth / 2);
                    container.scrollLeft = center;
                }
            }
        }, 100);

        if (musicRef.current) {
            musicRef.current.currentTime = 0;
            musicRef.current.play().catch(() => { });
        }
    };

    const toggleMute = () => setIsMuted(!isMuted);

    // Particles (Memoized)
    const hearts = useMemo(() => [...Array(30)].map((_, i) => ({
        id: i,
        left: Math.random() * 100 + "%",
        animationDuration: 6 + Math.random() * 10 + "s",
        animationDelay: -(Math.random() * 10) + "s",
        fontSize: 1 + Math.random() * 2 + "rem",
        opacity: 0.3 + Math.random() * 0.5
    })), []);

    const petals = useMemo(() => [...Array(20)].map((_, i) => ({
        id: i,
        left: Math.random() * 100 + "%",
        animationDuration: 10 + Math.random() * 10 + "s",
        animationDelay: -(Math.random() * 10) + "s",
        rotation: Math.random() * 360 + "deg",
        scale: 0.5 + Math.random() * 0.5
    })), []);


    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black select-none touch-manipulation cursor-pointer"

            onClick={handleTap}
        >
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet" />
            </Head>

            <style jsx global>{`
                @keyframes floatUp {
                    0% { transform: translateY(110vh) scale(0.5) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-10vh) scale(1.2) rotate(20deg); opacity: 0; }
                }
                @keyframes fallDown {
                    0% { transform: translateY(-10vh) rotate(0deg) translateX(0px); opacity: 0; }
                    10% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg) translateX(50px); opacity: 0; }
                }
                @keyframes ken-burns {
                    0% { transform: scale(1.0); }
                    100% { transform: scale(1.15); }
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes heartbeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.3); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.3); }
                    70% { transform: scale(1); }
                }
                @keyframes pop {
                    0% { transform: scale(0.8); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                .heart-particle {
                    position: absolute;
                    bottom: -10vh;
                    color: #ec4899;
                    user-select: none;
                    pointer-events: none;
                    animation-name: floatUp;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    text-shadow: 0 0 10px rgba(236, 72, 153, 0.5);
                }
                .petal-particle {
                    position: absolute;
                    top: -10vh;
                    width: 15px;
                    height: 15px;
                    background-color: #e11d48;
                    border-radius: 100% 0% 100% 0%;
                    opacity: 0.8;
                    box-shadow: 0 0 5px rgba(0,0,0,0.3);
                    animation-name: fallDown;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    pointer-events: none;
                }
                .ken-burns-active {
                    animation: ken-burns 15s ease-out forwards;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 1.5s ease-out forwards;
                    animation-delay: 0.5s;
                    opacity: 0;
                }
                .animate-fade-in {
                    animation: fadeIn 2s ease-in-out forwards;
                }
                .animate-heartbeat {
                    animation: heartbeat 1.5s ease-in-out infinite;
                }
                .animate-pop {
                    animation: pop 0.3s ease-out;
                }
                .real-sprockets {
                    height: 30px;
                    width: 100%;
                    background: repeating-linear-gradient(
                        90deg,
                        transparent 0px,
                        transparent 12px, 
                        #000 12px,
                        #000 24px 
                    );
                    border-top: 1px solid #333;
                    border-bottom: 1px solid #333;
                }
            `}</style>

            <audio ref={musicRef} src="/music/romantic.mp3" loop muted={isMuted} />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900 via-rose-950 to-black animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 via-orange-500/10 to-transparent mix-blend-overlay pointer-events-none"></div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {hearts.map((heart) => (
                    <div
                        key={heart.id}
                        className="heart-particle"
                        style={{
                            left: heart.left,
                            fontSize: heart.fontSize,
                            animationDuration: heart.animationDuration,
                            animationDelay: heart.animationDelay,
                            opacity: heart.opacity
                        }}
                    >
                        ♥
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {petals.map((petal) => (
                    <div
                        key={petal.id}
                        className="petal-particle"
                        style={{
                            left: petal.left,
                            width: (10 * petal.scale) + "px",
                            height: (10 * petal.scale) + "px",
                            animationDuration: petal.animationDuration,
                            animationDelay: petal.animationDelay,
                            transform: `rotate(${petal.rotation})`
                        }}
                    />
                ))}
            </div>

            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] animate-bounce-slow"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] opacity-60 pointer-events-none"></div>

            <div className="absolute top-4 right-4 z-50 flex gap-4 pointer-events-auto">

                {onClose && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="text-stone-400 hover:text-white text-4xl mix-blend-difference cursor-pointer transition-colors"
                        title="Close Reel"
                    >
                        &times;
                    </button>
                )}
            </div>

            {!showEnding && (
                <div className="w-full relative flex items-center py-12 z-10 perspective-[1000px] sepia-[0.2] contrast-[1.1] brightness-[0.9] pointer-events-none">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-hidden whitespace-nowrap w-full no-scrollbar"
                    >
                        <div className="inline-flex items-center py-12 px-[50vw]">
                            {films.map((film, index) => {
                                const isActive = index === activeSlideIndex;
                                const isLeft = index < activeSlideIndex;
                                const dist = Math.abs(index - activeSlideIndex);

                                let transformStyle = {};
                                let className = "transition-all duration-1000 ease-in-out relative group";
                                let contentClass = "border-4 border-black relative overflow-hidden shadow-2xl transition-all duration-1000 bg-black";
                                let imgClass = "w-full h-full object-cover transition-all duration-1000";

                                if (isActive) {
                                    className += " scale-150 z-50 mx-12 opacity-100 blur-0";
                                    transformStyle = { transform: "perspective(1000px) rotateY(0deg)" };
                                    contentClass += " w-48 h-36 sm:w-64 sm:h-48 md:w-80 md:h-60 shadow-white/10";
                                    imgClass += " sepia-0 contrast-110 ken-burns-active";
                                } else {
                                    const rotation = isLeft ? "25deg" : "-25deg";
                                    const blurAmount = dist === 1 ? "blur-[1px]" : "blur-[3px]";

                                    const opacity = dist === 1 ? "opacity-80" : "opacity-50";
                                    const scaling = dist === 1 ? "scale-95" : "scale-75";

                                    className += ` ${scaling} ${opacity} ${blurAmount} z-${40 - dist * 10} mx-[-10px]`;
                                    transformStyle = { transform: `perspective(1000px) rotateY(${rotation})` };
                                    contentClass += " w-48 h-36 sm:w-64 sm:h-48 md:w-80 md:h-60 shadow-black";
                                    imgClass += " sepia-[.4] brightness-90";
                                }

                                return (
                                    <div key={`${film._id}-${index}`} className={className} style={transformStyle}>
                                        <div className="real-sprockets"></div>
                                        <div className="bg-black px-2 md:px-4 py-0 flex justify-center">
                                            <div className={contentClass}>
                                                <img
                                                    src={film.imageUrl}
                                                    alt="Memory"
                                                    className={imgClass}
                                                    style={{ objectPosition: "50% 20%" }}
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent transition-opacity duration-1000 flex items-end justify-center p-6 ${isActive ? "opacity-100" : "opacity-0"}`}>
                                                    <p className="text-white text-2xl md:text-3xl text-center whitespace-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-fade-in-up"
                                                        style={{ fontFamily: "'Great Vibes', cursive", textShadow: "0 0 10px rgba(255,255,255,0.3)" }}>
                                                        "{film.quote}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="real-sprockets"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {showEnding && (
                <div
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/80 animate-fade-in px-4 text-center pointer-events-auto"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >

                    <div className="text-[150px] md:text-[200px] text-red-600 animate-heartbeat drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] transition-transform duration-500">
                        {proposalStatus === 'yes' ? '💖' : '❤️'}
                    </div>

                    {proposalStatus === 'yes' ? (
                        <div className="animate-pop">
                            <h1 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-5xl sm:text-6xl md:text-8xl text-pink-500 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] mt-8 mb-4">
                                She Said YES!
                            </h1>
                            <p className="text-2xl md:text-4xl text-white font-serif italic mb-2">“Our story just began…”</p>
                            <p className="text-2xl md:text-3xl text-stone-300 font-serif italic mb-2">“Forever starts today.”</p>
                            <p className="text-2xl md:text-3xl text-rose-400 font-serif italic mb-8">“Best decision of my life.” 💍</p>
                        </div>
                    ) : (
                        <>
                            <h1 style={{ fontFamily: "'Great Vibes', cursive" }} className="text-4xl sm:text-6xl md:text-8xl text-red-500 drop-shadow-[0_5px_5px_rgba(0,0,0,1)] mt-8 mb-4">
                                Happy Valentine’s Day
                            </h1>
                            <p className="text-xl md:text-2xl text-stone-300 font-serif italic mb-2">
                                "In all the world, there is no heart for me like yours."
                            </p>
                            <p style={{ fontFamily: "'Great Vibes', cursive" }} className="text-3xl sm:text-4xl md:text-5xl text-white mt-4 mb-12 drop-shadow-lg">
                                Will you be my Valentine forever?
                            </p>
                        </>
                    )}

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {proposalStatus !== 'yes' && (
                            <>
                                <button
                                    onClick={handleYes}
                                    className="bg-green-600 hover:bg-green-500 text-white font-serif italic text-2xl px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-110 shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-pulse"
                                >
                                    YES! 💍
                                </button>
                                <button
                                    onMouseEnter={handleNo}
                                    onClick={handleNo}
                                    className="bg-stone-800/50 hover:bg-red-500/20 text-stone-400 hover:text-red-300 font-serif italic text-lg px-6 py-2 rounded-full transition-all duration-300 border border-stone-700"
                                >
                                    No...
                                </button>
                            </>
                        )}

                        <button
                            onClick={replayReel}
                            className="bg-transparent border-2 border-stone-500 text-stone-400 hover:border-white hover:text-white font-serif italic text-lg px-6 py-2 rounded-full transition-all duration-300 opacity-80 hover:opacity-100"
                        >
                            Replay Story ↺
                        </button>
                    </div>
                </div>
            )}

            {!showEnding && (
                <div className="absolute bottom-10 text-stone-500 font-serif italic text-sm animate-pulse z-20 pointer-events-none transition-opacity duration-300">
                    {isUserPaused ? "⏸️ Paused" : "Running... Tap screen to Pause"}
                </div>
            )}

            {!showEnding && (
                <div className="absolute bottom-20 left-0 right-0 z-50 px-8 md:px-20 flex items-center justify-center gap-2 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {films.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                setActiveSlideIndex(idx);
                                setIsUserPaused(false);
                            }}
                            className={`rounded-full transition-all duration-300 cursor-pointer shadow-lg ${idx === activeSlideIndex
                                ? "bg-white w-3 h-3 scale-125 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                : idx < activeSlideIndex
                                    ? "bg-rose-500/80 w-2 h-2 hover:scale-125"
                                    : "bg-white/30 w-2 h-2 hover:bg-white/60 hover:scale-125"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
