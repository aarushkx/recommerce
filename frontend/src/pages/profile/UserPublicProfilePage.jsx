import Avatar from "../../components/user/Avatar";
import UserInfo from "../../components/user/UserInfo";
import UserProductGrid from "../../components/user/UserProductGrid";
import { Mail, Loader2 } from "lucide-react";
import { useUser, useAuth } from "../../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ReviewSection from "../../components/user/ReviewsSection";
const UserPublicProfilePage = () => {
    const { userId } = useParams();

    const navigate = useNavigate();
    const { data: currentUser } = useAuth();
    useEffect(() => {
        if (currentUser && currentUser._id === userId) {
            navigate("/profile"); // redirect to own profile
        }
    }, [currentUser, userId, navigate]);
    const { data: user, isLoading } = useUser(userId);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen">
            {/* Profile Header */}
            <div className="max-w-3xl mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-12">
                    {/* Left Side */}

                    <div className="flex flex-col items-center gap-6">
                        <Avatar user={user} size="w-28" />

                        <div className="text-center">
                            <h2 className="text-2xl font-bold">{user.name}</h2>

                            <div className="flex items-center justify-center gap-2 mt-1">
                                <Mail className="w-4 h-4 text-primary" />
                                <p className="text-base-content/70">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            className="btn btn-outline btn-primary btn-sm"
                            onClick={() => navigate(`/reviews/${userId}`)}
                        >
                            Post Review
                        </button>
                    </div>

                    {/* Right Side */}
                    <div className="w-full max-w-md">
                        <UserInfo user={user} />
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <div className="divider my-8" />
                <UserProductGrid userId={userId} />
            </div>

            {/* Reviews Section */}
                        <div className="max-w-4xl mx-auto px-4 pb-16">
                            <div className="divider my-8" />
                            <ReviewSection userId={userId} />
                        </div>
        </div>
    );
};

export default UserPublicProfilePage;
