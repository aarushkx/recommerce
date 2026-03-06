import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postFeedback } from "../../api/feedback.api";
import { Loader2, MessageSquare, Send } from "lucide-react";

const UserFeedbackPage = () => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const feedbackMutation = useMutation({
        mutationFn: postFeedback,
        onSuccess: () => {
            setSuccess("Feedback sent successfully. Thank you!");
            setMessage("");
        },
        onError: (err) => {
            setError(err?.response?.data?.message || "Failed to send feedback");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!message.trim()) {
            return setError("Feedback message cannot be empty");
        }

        feedbackMutation.mutate({ message });
    };

    return (
        <div className="min-h-screen max-w-3xl mx-auto px-4 py-16">
            {/* HEADER */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Feedback</h1>
                <p className="text-base-content/60 text-sm">
                    Help us improve by sharing your thoughts
                </p>
            </div>

            <div className="divider my-8" />

            {/* FEEDBACK FORM */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                    <textarea
                        className="textarea textarea-bordered w-full h-40"
                        placeholder="Tell us what you like, what could be improved, or report an issue..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                {error && <div className="text-error text-sm">{error}</div>}

                {success && (
                    <div className="text-success text-sm">{success}</div>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end pt-6 border-t border-base-300">
                    <button
                        type="submit"
                        className="btn btn-outline btn-primary w-fit"
                        disabled={feedbackMutation.isPending}
                    >
                        {feedbackMutation.isPending && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        <Send className="w-4 h-4" />
                        Send Feedback
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserFeedbackPage;
