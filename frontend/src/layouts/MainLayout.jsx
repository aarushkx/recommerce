import Header from "../components/header/Header";

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main className="pt-16 px-6">{children}</main>
        </div>
    );
};

export default MainLayout;
