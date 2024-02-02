"use client";

import React, { useContext } from "react";

export type ProjectGeneralSearchContextType = {
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
 * Context for holding search options for the Project pages.
 */
export const ProjectGeneralSearchContext = React.createContext<
    ProjectGeneralSearchContextType | undefined
>(undefined);

export const useProjectGeneralSearchContext = (): ProjectGeneralSearchContextType => {
    const context = useContext(ProjectGeneralSearchContext);
    if (!context) {
        throw new Error(
            "Please use ProjectGeneralSearchContext within an ProjectGeneralSearchContextProvider"
        );
    }
    return context;
};

export const ProjectGeneralSearchProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [inputQuery, setInputQuery] = React.useState("");
    const [filters, setFilters] = React.useState<Record<string, any>>({});
    const [sortOption, setSortOption] = React.useState("updated_at");
    const [descending, setDescending] = React.useState(true);

    return (
        <ProjectGeneralSearchContext.Provider
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
        </ProjectGeneralSearchContext.Provider>
    );
};
