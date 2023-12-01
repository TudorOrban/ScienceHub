"use client";

import React, { useContext } from "react";

export type BrowseDiscussionsSearchContextType = {
    inputQuery: string;
    filters: Record<string, any>;
    sortOption: string;
    descending: boolean;

    setInputQuery: React.Dispatch<React.SetStateAction<string>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    setDescending: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BrowseDiscussionsSearchContext = React.createContext<
    BrowseDiscussionsSearchContextType | undefined
>(undefined);

export const useBrowseDiscussionsSearchContext = (): BrowseDiscussionsSearchContextType => {
    const context = useContext(BrowseDiscussionsSearchContext);
    if (!context) {
        throw new Error("Please use BrowseDiscussionsSearchContext within an BrowseDiscussionsSearchContextProvider");
    };
    return context;
}

export const BrowseDiscussionsSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inputQuery, setInputQuery] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [sortOption, setSortOption] = React.useState("updated_at");
    const [descending, setDescending] = React.useState(true);

    return (
        <BrowseDiscussionsSearchContext.Provider
            value={{
                inputQuery,
                filters,
                sortOption,
                descending,
                setInputQuery,
                setFilters,
                setSortOption,
                setDescending
            }}
        >
            {children}
        </BrowseDiscussionsSearchContext.Provider>
    );
};
