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
            page: 1, // Send the user back to page 1 because the list of results has completely changed
        })),

    setPage: (page) => set({ page }),
}));

export default useProductFilterStore;
