import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FilmReel from "@/components/FilmReel";
import AddFilmForm from "@/components/AddFilmForm";

export default function Home() {
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/landing");
        }
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilmAdded = () => {
        setRefreshKey(prev => prev + 1);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-black min-h-screen relative">
            <FilmReel key={refreshKey} openModal={() => setIsModalOpen(true)} />

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-12 right-0 text-white text-4xl hover:text-red-500 transition-colors"
                        >
                            &times;
                        </button>
                        <AddFilmForm onFilmAdded={handleFilmAdded} />
                    </div>
                </div>
            )}
        </div>
    );
}
