import { Trash2, Plus } from "lucide-react";

const AddImage = ({ images, setImages }) => {
    const handleFileChange = (e) => {
        if (!e.target.files) return;

        const newFiles = [];
        Array.from(e.target.files).forEach((file) => {
            newFiles.push({
                id: crypto.randomUUID(),
                file,
                preview: URL.createObjectURL(file),
            });
        });

        setImages((prev) => [...prev, ...newFiles]);
        e.target.value = null;
    };

    const removeImage = (id) => {
        setImages((prev) => {
            const removed = prev.find((img) => img.id === id);
            if (removed) URL.revokeObjectURL(removed.preview);
            return prev.filter((img) => img.id !== id);
        });
    };

    return (
        <div className="flex flex-wrap gap-4 items-start">
            {/* Add Photo */}
            <label className="w-32 h-32 border-2 border-dashed border-base-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-base-200 transition shrink-0">
                <Plus className="w-6 h-6 text-base-content/40" />
                <span className="text-xs text-base-content/40 mt-1">
                    Add Photo
                </span>

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            {/* Uploaded images */}
            {images.map((img) => (
                <div key={img.id} className="relative group w-32 h-32">
                    <img
                        src={img.preview}
                        alt="preview"
                        className="w-full h-full object-cover rounded-lg border border-base-300"
                    />

                    <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="btn btn-circle btn-error btn-xs absolute -top-2 -right-2 transition"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AddImage;
