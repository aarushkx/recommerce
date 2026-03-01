import Logo from "./Logo";
import LocationBox from "./LocationBox";
import SearchBar from "./SearchBar";
import Filter from "./Filter";
import FavoritesButton from "./FavoritesButton";
import Avatar from "./Avatar";

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-base-100 border-b">
            <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">
                {/* Left Section (Desktop Only) */}
                <div className="hidden md:flex items-center gap-4">
                    <Logo />
                    <LocationBox />
                </div>

                {/* Center Section */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="flex items-center gap-2 w-full md:max-w-xl">
                        <SearchBar />
                        <Filter />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-1 md:gap-2">
                    <FavoritesButton />
                    <Avatar />
                </div>
            </div>
        </header>
    );
};

export default Header;
