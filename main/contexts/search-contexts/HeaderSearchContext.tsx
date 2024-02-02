"use client";

import React, { useContext } from "react";

export type HeaderSearchContextType = {
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
 * Context for holding search options for the Header search.
 */
export const HeaderSearchContext = React.createContext<HeaderSearchContextType | undefined>(
    undefined
);

export const useHeaderSearchContext = (): HeaderSearchContextType => {
    const context = useContext(HeaderSearchContext);
    if (!context) {
        throw new Error("Please use HeaderSearchContext within an HeaderSearchContextProvider");
    }
    return context;
};

export const HeaderSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inputQuery, setInputQuery] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [sortOption, setSortOption] = React.useState("updated_at");
    const [descending, setDescending] = React.useState(true);

    return (
        <HeaderSearchContext.Provider
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
        </HeaderSearchContext.Provider>
    );
};
