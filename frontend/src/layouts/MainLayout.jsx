import Header from "../components/header/Header";

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main
                style={{ paddingTop: "var(--header-height, 64px)" }}
                className="px-6"
            >
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
