import { useEffect, useState } from "react";
import { populateAction } from "../pipes/PresetPipes";

export default function usePresets() {
    const [hasPresets, setHasPresets] = useState(0);

    useEffect(() => {
        const configurePresets = async () => {
            await populateAction(['settings', 'tournaments', 'chipsets']);
        }

        if (!hasPresets) {
            const timer = setTimeout(configurePresets, 100);
            return () => {
                clearTimeout(timer);
            }
        }
    }, [hasPresets]);

    return () => {
        setHasPresets(hasPresets + 1);
    };
}
