import { create } from "zustand";

const useProductFilterStore = create((set) => ({
    page: 1,
    limit: 10,
    category: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "newest",

    setFilter: (key, value) =>
        set((state) => ({
            ...state,
            [key]: value,
            page: 1, // reset page on filter change
        })),

    setPage: (page) => set({ page }),
}));

export default useProductFilterStore;
