import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

const DebouncedInput = ({ value, onChange, delay = 400, ...props }) => {
    const [localValue, setLocalValue] = useState(value || "");

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    const debouncedOnChange = useDebouncedCallback((val) => {
        onChange(val);
    }, delay);

    return (
        <input
            {...props}
            value={localValue}
            onChange={(e) => {
                setLocalValue(e.target.value);
                debouncedOnChange(e.target.value);
            }}
        />
    );
};

export default DebouncedInput;
