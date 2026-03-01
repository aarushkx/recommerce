import { create } from "zustand";

const initialState = {
    page: 1,
    limit: 10,
    category: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sort: "newest",
};

const useProductFilterStore = create((set) => ({
    ...initialState,

    setFilter: (key, value) =>
        set((state) => ({
            ...state,
            [key]: value,
            page: 1,
        })),

    setPage: (page) => set({ page }),

    resetFilters: () =>
        set({
            ...initialState,
        }),
}));

export default useProductFilterStore;
