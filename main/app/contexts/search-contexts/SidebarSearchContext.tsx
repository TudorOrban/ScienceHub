"use client";

import React, { useContext } from "react";

export type SidebarSearchContextType = {
    inputQuery: string;
    filters: Record<string, any>;
    sortOption: string;
    descending: boolean;

    setInputQuery: React.Dispatch<React.SetStateAction<string>>;
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    setDescending: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SidebarSearchContext = React.createContext<
    SidebarSearchContextType | undefined
>(undefined);

export const useSidebarSearchContext = (): SidebarSearchContextType => {
    const context = useContext(SidebarSearchContext);
    if (!context) {
        throw new Error("Please use SidebarSearchContext within an SidebarSearchContextProvider");
    };
    return context;
}

export const SidebarSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inputQuery, setInputQuery] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [sortOption, setSortOption] = React.useState("updated_at");
    const [descending, setDescending] = React.useState(true);

    return (
        <SidebarSearchContext.Provider
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
        </SidebarSearchContext.Provider>
    );
};
