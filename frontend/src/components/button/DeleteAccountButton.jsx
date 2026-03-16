import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "../../api/user.api";
import { useNavigate } from "react-router-dom";

const DeleteAccountButton = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const deleteMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            queryClient.clear();
            navigate("/login");
        },
    });

    return (
        <>
            <button
                className="btn btn-error w-fit"
                onClick={() => setShowConfirm(true)}
            >
                Delete Account
            </button>

            {showConfirm && (
                <div className="modal modal-open">
                    <div className="modal-box space-y-4">
                        <h3 className="font-bold text-lg text-error">
                            Confirm Account Deletion
                        </h3>

                        <p className="text-sm">
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                        </p>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-error"
                                onClick={() => deleteMutation.mutate()}
                                disabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteAccountButton;
