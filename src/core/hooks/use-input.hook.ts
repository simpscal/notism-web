import { useState, useCallback } from 'react';

interface UseInputOptions {
    transform?: (value: string) => string;
    validate?: (value: string) => boolean;
    debounce?: number;
}

export function useInput(initialValue: string, options: UseInputOptions = {}) {
    const [value, setValue] = useState(initialValue);
    const { transform, validate } = options;

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            let newValue = e.target.value;

            if (transform) {
                newValue = transform(newValue);
            }

            if (validate && !validate(newValue)) {
                return;
            }

            setValue(newValue);
        },
        [transform, validate]
    );

    const bind = {
        value,
        onChange: handleChange,
    };

    return [value, bind, setValue] as const;
}
