"use client";

import React, { useContext } from 'react';

export type ProjectSelectionContextType = {
    selectedProjectId: number;
    setSelectedProjectId: React.Dispatch<React.SetStateAction<number>>;
};

export const ProjectSelectionContext = React.createContext<ProjectSelectionContextType | undefined>(
    undefined
);

export const useProjectSelectionContext = (): ProjectSelectionContextType => {
    const context = useContext(ProjectSelectionContext);
    if (!context) {
        throw new Error("Please use ProjectSelectionContext within an ProjectSelectionContextProvider");
    };
    return context;
}

export const ProjectSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedProjectId, setSelectedProjectId] = React.useState<number>(0);

    return (
        <ProjectSelectionContext.Provider
            value={{
                selectedProjectId,
                setSelectedProjectId
            }}
        >
            {children}
        </ProjectSelectionContext.Provider>
    );
};
