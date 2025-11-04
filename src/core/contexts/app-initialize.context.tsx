import { createContext, useCallback, useState } from 'react';

type AppInitializeProviderProps = {
    children: React.ReactNode;
};

type AppInitializeContextState = {
    isInitialized: boolean;
    initialize: () => Promise<void>;
};

const AppInitializeContext = createContext<AppInitializeContextState>({
    isInitialized: false,
    initialize: async () => {},
});

function AppInitializeProvider({ children }: AppInitializeProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);

    const initialize = useCallback(async () => {
        if (isInitialized || isInitializing) {
            return;
        }

        setIsInitializing(true);

        // Simulate an initialization process
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsInitialized(true);
        setIsInitializing(false);
    }, [isInitialized, isInitializing]);

    return (
        <AppInitializeContext.Provider value={{ isInitialized, initialize }}>{children}</AppInitializeContext.Provider>
    );
}

export { AppInitializeContext, AppInitializeProvider };
