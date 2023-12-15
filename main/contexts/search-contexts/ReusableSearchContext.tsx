"use client";

import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";

export type ReusableSearchContextType = {
    inputQuery: string;
    filters: Record<string, any>;
    sortOption: string;
    descending: boolean;

    setInputQuery: React.Dispatch<React.SetStateAction<string>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    setDescending: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ReusableSearchContext = React.createContext<
ReusableSearchContextType | undefined
>(undefined);

export const useReusableSearchContext = (): ReusableSearchContextType => {
    const context = useContext(ReusableSearchContext);
    if (!context) {
        throw new Error("Please use ReusableSearchContext within an ReusableSearchContextProvider");
    };
    return context;
}

export const ReusableSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        <ReusableSearchContext.Provider
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
        </ReusableSearchContext.Provider>
    );
};
