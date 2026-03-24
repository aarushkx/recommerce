import { Trash2, Plus } from "lucide-react";

const AddImage = ({ images, setImages, maxImages = 5 }) => {
    const isSingle = maxImages === 1;

    const handleFileChange = (e) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        // If single mode, we only take the first file and replace the current state
        if (isSingle) {
            const file = files[0];
            if (file) {
                // Revoke old preview if exists to save memory
                if (images.length > 0) URL.revokeObjectURL(images[0].preview);

                setImages([
                    {
                        id: crypto.randomUUID(),
                        file,
                        preview: URL.createObjectURL(file),
                    },
                ]);
            }
        } else {
            // Multiple mode logic
            const availableSlots = maxImages - images.length;
            const newFiles = files.slice(0, availableSlots).map((file) => ({
                id: crypto.randomUUID(),
                file,
                preview: URL.createObjectURL(file),
            }));

            setImages((prev) => [...prev, ...newFiles]);
        }

        e.target.value = null; // Reset input
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
            {/* Show Add button only if we haven't reached the limit */}
            {images.length < maxImages && (
                <label className="w-32 h-32 border-2 border-dashed border-base-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-base-200 transition shrink-0">
                    <Plus className="w-6 h-6 text-base-content/40" />
                    <span className="text-xs text-base-content/40 mt-1">
                        {isSingle ? "Upload Photo" : "Add Photos"}
                    </span>

                    <input
                        type="file"
                        multiple={!isSingle}
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            )}

            {/* Preview list */}
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
