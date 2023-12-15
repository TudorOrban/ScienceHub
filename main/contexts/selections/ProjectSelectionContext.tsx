"use client";

import React, { useContext } from 'react';

export type ProjectSelectionContextType = {
    selectedProjectId: string;
    setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>;
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
    const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");

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
