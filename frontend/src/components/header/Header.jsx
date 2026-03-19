import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import LocationBox from "./LocationBox";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import FavoritesButton from "./FavoritesButton";
import UserButton from "./UserButton";
import AdminBanner from "../admin/AdminBanner";
import { Search, X } from "lucide-react";

const Header = () => {
    const headerRef = useRef(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
                const height = headerRef.current.offsetHeight;
                document.documentElement.style.setProperty(
                    "--header-height",
                    `${height}px`,
                );
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 z-50 w-full border-b border-accent/40 bg-base-100"
        >
            {/* Admin Banner */}
            <AdminBanner />

            <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
                {/* Mobile Search View */}
                {isSearchOpen ? (
                    <div className="flex w-full items-center gap-2 md:hidden">
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="btn btn-ghost btn-sm btn-circle"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex-1">
                            <SearchBar autoFocus />
                        </div>
                        <Filter />
                    </div>
                ) : (
                    // Standard View
                    <>
                        {/* Left Section */}
                        <div className="flex items-center gap-4">
                            <Logo />
                            <div className="hidden md:block">
                                <LocationBox />
                            </div>
                        </div>

                        {/* Center Section (Desktop) */}
                        <div className="hidden flex-1 items-center justify-center md:flex">
                            <div className="flex w-full max-w-xl items-center gap-2">
                                <SearchBar />
                                <Filter />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-1 md:gap-2">
                            {/* Mobile Search Toggle Button */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="btn btn-ghost btn-circle md:hidden"
                            >
                                <Search size={20} />
                            </button>

                            <FavoritesButton />
                            <UserButton />
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
