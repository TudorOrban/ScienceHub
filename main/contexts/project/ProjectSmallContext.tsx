"use client";

import { ProjectSmall } from '@/types/projectTypes';
import React, { useContext, useState } from 'react';

export type ProjectSmallContextType = {
    projectSmall: ProjectSmall;
    setProjectSmall: (projectSmall: ProjectSmall) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    currentTab: string;
    setCurrentTab: (tab: string) => void;
};

export const ProjectSmallContext = React.createContext<ProjectSmallContextType | undefined>(
    undefined
);

export const useProjectSmallContext = (): ProjectSmallContextType => {
    const context = useContext(ProjectSmallContext);
    if (!context) {
        throw new Error("Please use ProjectSmallContext within a ProjectSmallContextProvider");
    };
    return context;
}

export const ProjectSmallProvider: React.FC<{ initialProjectSmall: ProjectSmall, children: React.ReactNode }> = ({ initialProjectSmall, children }) => {
    const [projectSmall, setProjectSmall] = useState<ProjectSmall>(initialProjectSmall);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState<string>("");

    return (
        <ProjectSmallContext.Provider
            value={{
                projectSmall,
                setProjectSmall,
                isLoading,
                setIsLoading,
                currentTab,
                setCurrentTab,
            }}
        >
            {children}
        </ProjectSmallContext.Provider>
    );
};
