"use client";

import React, { useContext } from "react";

export type BrowsePeopleSearchContextType = {
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
 * Context for holding search options for the Browse People page.
 * To be used once Browse People is implemented.
 */
export const BrowsePeopleSearchContext = React.createContext<
    BrowsePeopleSearchContextType | undefined
>(undefined);

export const useBrowsePeopleSearchContext = (): BrowsePeopleSearchContextType => {
    const context = useContext(BrowsePeopleSearchContext);
    if (!context) {
        throw new Error(
            "Please use BrowsePeopleSearchContext within an BrowsePeopleSearchContextProvider"
        );
    }
    return context;
};

export const BrowsePeopleSearchProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [inputQuery, setInputQuery] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [sortOption, setSortOption] = React.useState("updated_at");
    const [descending, setDescending] = React.useState(true);

    return (
        <BrowsePeopleSearchContext.Provider
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
        </BrowsePeopleSearchContext.Provider>
    );
};
