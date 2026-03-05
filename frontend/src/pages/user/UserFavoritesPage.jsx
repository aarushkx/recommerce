import { Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, removeFromFavorites } from "../../api/user.api";
import FavoriteProduct from "../../components/user/FavoriteProduct";

const UserFavoritesPage = () => {
    const queryClient = useQueryClient();

    const { data: favorites, isLoading } = useQuery({
        queryKey: ["favorites"],
        queryFn: getFavorites,
    });

    const removeMutation = useMutation({
        mutationFn: removeFromFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading favorites...</span>
            </div>
        );
    }

    if (!favorites || favorites.length === 0) {
        return (
            <div className="flex items-center justify-center py-24 gap-2 text-base-content/60">
                <p className="text-base-content/60">
                    You have not added any product to your favorites yet.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>

            <div className="divide-y divide-base-200">
                {favorites.map((product) => (
                    <FavoriteProduct
                        key={product._id}
                        product={product}
                        onRemove={(id) => removeMutation.mutate(id)}
                        isRemoving={
                            removeMutation.isPending &&
                            removeMutation.variables === product._id
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default UserFavoritesPage;
