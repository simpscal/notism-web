import { createContext, useEffect, useState } from 'react';

type AppInitializeProviderProps = {
    children: React.ReactNode;
};

type AppInitializeContextState = {
    isInitialized: boolean;
};

export const AppInitializeContext = createContext<AppInitializeContextState>({
    isInitialized: false,
});

export function AppInitializeProvider({ children }: AppInitializeProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Simulate an initialization process
        setTimeout(() => {
            setIsInitialized(true);
        }, 1000);
    }, []);

    return <AppInitializeContext.Provider value={{ isInitialized }}>{children}</AppInitializeContext.Provider>;
}
