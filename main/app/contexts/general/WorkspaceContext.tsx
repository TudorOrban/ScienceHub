"use client";

import React, { useContext, useState } from 'react';

export type WorkspaceContextType = {
    // currentUserId?: string;
    // currentTab: string;
    // setCurrentTab: (tab: string) => void;
};

export const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(
    undefined
);

export const useWorkspaceContext = (): WorkspaceContextType => {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error("Please use WorkspaceContext within a ProjectDataContextProvider");
    };
    return context;
}

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // const [projectLayout, setProjectLayout] = useState<ProjectLayout>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentTab, setCurrentTab] = useState<string>("");

    return (
        <WorkspaceContext.Provider
            value={{
                // projectLayout,
                // setProjectLayout,
                isLoading,
                setIsLoading,
                currentTab,
                setCurrentTab,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
};
