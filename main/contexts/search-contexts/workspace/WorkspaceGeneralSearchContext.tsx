"use client";

import React, { useContext } from "react";

// Currently supports all useUnifiedSearch's throughout Workspace - needs update
export type WorkspaceGeneralSearchContextType = {
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
 * Context for holding search options for the Workspace pages.
 */
export const WorkspaceGeneralSearchContext = React.createContext<
    WorkspaceGeneralSearchContextType | undefined
>(undefined);

export const useWorkspaceGeneralSearchContext = (): WorkspaceGeneralSearchContextType => {
    const context = useContext(WorkspaceGeneralSearchContext);
    if (!context) {
        throw new Error("Please use WorkspaceGeneralSearchContext within an WorkspaceGeneralSearchContextProvider");
    };
    return context;
}

export const WorkspaceGeneralSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inputQuery, setInputQuery] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [sortOption, setSortOption] = React.useState("updated_at");
    const [descending, setDescending] = React.useState(true);

    return (
        <WorkspaceGeneralSearchContext.Provider
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
        </WorkspaceGeneralSearchContext.Provider>
    );
};
