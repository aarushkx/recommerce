const Footer = () => {
    const startYear = import.meta.env.VITE_START_YEAR;
    const currentYear = new Date().getFullYear();

    const YEAR_DISPLAY =
        currentYear > startYear ? `${startYear} - ${currentYear}` : startYear;

    return (
        <footer className="border-t border-base-300 py-6">
            <div className="flex flex-col items-center justify-center gap-2">
                {/* Logo */}
                <img
                    src="/logo.png"
                    alt={`${import.meta.env.VITE_APP_NAME} logo`}
                    className="h-8 w-auto"
                />

                {/* Copyright */}
                <div className="text-sm text-base-content/40">
                    © {YEAR_DISPLAY} {import.meta.env.VITE_APP_NAME}. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
