"use client";

import { ProjectLayout } from "@/types/projectTypes";
import React, { useContext, useState } from "react";

export type ProjectDataContextType = {
    projectLayout: ProjectLayout;
    setProjectLayout: (projectLayout: ProjectLayout) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    currentTab: string;
    setCurrentTab: (tab: string) => void;
};

/**
 * Context for holding current project data. To be removed in the future, see ProjectHeader.
 */
export const ProjectDataContext = React.createContext<ProjectDataContextType | undefined>(
    undefined
);

export const useProjectDataContext = (): ProjectDataContextType => {
    const context = useContext(ProjectDataContext);
    if (!context) {
        throw new Error("Please use ProjectDataContext within a ProjectDataContextProvider");
    }
    return context;
};

export const ProjectDataProvider: React.FC<{
    initialProjectLayout: ProjectLayout;
    children: React.ReactNode;
}> = ({ initialProjectLayout, children }) => {
    const [projectLayout, setProjectLayout] = useState<ProjectLayout>(initialProjectLayout);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState<string>("");

    return (
        <ProjectDataContext.Provider
            value={{
                projectLayout,
                setProjectLayout,
                isLoading,
                setIsLoading,
                currentTab,
                setCurrentTab,
            }}
        >
            {children}
        </ProjectDataContext.Provider>
    );
};
