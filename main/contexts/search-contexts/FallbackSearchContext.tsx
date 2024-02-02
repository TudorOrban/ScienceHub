"use client";

import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";

export type FallbackSearchContextType = {
    inputQuery: string;
    filters: Record<string, any>;
    sortOption: string;
    descending: boolean;
    setInputQuery: React.Dispatch<React.SetStateAction<string>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    setDescending: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Fallback Context for holding search options.
 */
export const FallbackSearchContext = React.createContext<FallbackSearchContextType | undefined>(
    undefined
);

export const useFallbackSearchContext = (): FallbackSearchContextType => {
    const context = useContext(FallbackSearchContext);
    if (!context) {
        throw new Error("Please use FallbackSearchContext within an FallbackSearchContextProvider");
    }
    return context;
};

export const FallbackSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inputQuery, setInputQuery] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [sortOption, setSortOption] = React.useState("updated_at");
    const [descending, setDescending] = React.useState(true);

    const pathname = usePathname();

    useEffect(() => {
        setInputQuery("");
        setFilters({});
        setSortOption("updated_at");
        setDescending(true);
    }, [pathname]);

    return (
        <FallbackSearchContext.Provider
            value={{
                inputQuery,
                filters,
                sortOption,
                descending,
                setInputQuery,
                setFilters,
                setSortOption,
                setDescending,
            }}
        >
            {children}
        </FallbackSearchContext.Provider>
    );
};
