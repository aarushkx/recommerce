import { api } from "./axios";

export const updateProfile = (data) => api.patch("/user/update-profile", data);

export const deleteAccount = () => api.delete("/user/delete-account");
