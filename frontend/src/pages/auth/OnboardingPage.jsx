import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../../api/auth.api";

const OnboardingPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        area: "",
        pincode: "",
        city: "",
        state: "",
        country: "",
        avatar: null,
    });

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            navigate("/home");
        },
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm({ ...form, avatar: file });
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        const formData = new FormData();
        const {
            name,
            email,
            phoneNumber,
            password,
            area,
            pincode,
            city,
            state,
            country,
        } = form;

        formData.append("name", name);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("password", password);
        formData.append(
            "location",
            JSON.stringify({ area, pincode, city, state, country }),
        );
        if (form.avatar) formData.append("avatar", form.avatar);
        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex justify-center items-center p-4">
            <div className="card w-full max-w-lg p-8 flex flex-col min-h-150">
                {/* Step Indicator */}
                <ul className="steps mb-8 w-full justify-center shrink-0">
                    <li className={`step ${step >= 1 ? "step-primary" : ""}`} />
                    <li className={`step ${step >= 2 ? "step-primary" : ""}`} />
                    <li className={`step ${step >= 3 ? "step-primary" : ""}`} />
                </ul>

                {/* Content Area */}
                <div className="grow flex flex-col justify-start">
                    {/* Step 1 */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-2xl font-bold text-center mb-2">
                                Create Account
                            </h2>

                            <input
                                className="input input-bordered w-full"
                                placeholder="Full Name *"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />
                            <input
                                className="input w-full"
                                type="email"
                                placeholder="Email *"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                            />
                            <input
                                className="input w-full"
                                placeholder="Phone Number *"
                                value={form.phoneNumber}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phoneNumber: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="input w-full"
                                type="password"
                                placeholder="Password *"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                            />
                        </div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="text-2xl font-bold text-center mb-2">
                                Your Location
                            </h2>

                            <input
                                className="input w-full"
                                placeholder="Area *"
                                value={form.area}
                                onChange={(e) =>
                                    setForm({ ...form, area: e.target.value })
                                }
                            />
                            <input
                                className="input w-full"
                                placeholder="Pincode *"
                                value={form.pincode}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        pincode: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="input w-full"
                                placeholder="City *"
                                value={form.city}
                                onChange={(e) =>
                                    setForm({ ...form, city: e.target.value })
                                }
                            />
                            <input
                                className="input w-full"
                                placeholder="State *"
                                value={form.state}
                                onChange={(e) =>
                                    setForm({ ...form, state: e.target.value })
                                }
                            />
                            <input
                                className="input w-full"
                                placeholder="Country *"
                                value={form.country}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        country: e.target.value,
                                    })
                                }
                            />
                        </div>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4 items-center w-full">
                            <h2 className="text-2xl font-bold text-center mb-2">
                                Upload Avatar (Optional)
                            </h2>

                            <div className="avatar mb-4">
                                {avatarPreview ? (
                                    <div className="w-24 rounded-full shadow-md">
                                        <img
                                            src={avatarPreview}
                                            alt="Preview"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 rounded-full shadow-md">
                                        <img
                                            src={`/default-avatar.png`}
                                            alt="Default Avatar"
                                        />
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                className="file-input w-full"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />

                            {mutation.isError && (
                                <p className="text-error text-sm text-center">
                                    {mutation.error?.response?.data?.message ||
                                        mutation.error?.message ||
                                        "Something went wrong"}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-8 shrink-0">
                    {step > 1 && (
                        <button
                            className="btn btn-outline flex-1"
                            onClick={() => setStep(step - 1)}
                        >
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            className="btn btn-block flex-1"
                            onClick={() => setStep(step + 1)}
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary flex-1"
                            onClick={handleSubmit}
                        >
                            {mutation.isPending
                                ? "Creating account..."
                                : "Finish"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
