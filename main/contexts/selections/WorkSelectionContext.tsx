"use client";

import React, { useContext } from 'react';

export type WorkSelectionContextType = {
    selectedWorkType: string;
    selectedWorkId: string;
    projectId?: number;
    setSelectedWorkType: (workType: string) => void;
    setSelectedWorkId: React.Dispatch<React.SetStateAction<string>>;
    setProjectId: (projectId: number | undefined) => void;
};

export const WorkSelectionContext = React.createContext<WorkSelectionContextType | undefined>(
    undefined
);

export const useWorkSelectionContext = (): WorkSelectionContextType => {
    const context = useContext(WorkSelectionContext);
    if (!context) {
        throw new Error("Please use WorkSelectionContext within an WorkSelectionContextProvider");
    };
    return context;
}

export const WorkSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedWorkType, setSelectedWorkType] = React.useState<string>("");
    const [selectedWorkId, setSelectedWorkId] = React.useState<string>("");
    const [projectId, setProjectId] = React.useState<number>();

    return (
        <WorkSelectionContext.Provider
            value={{
                selectedWorkType,
                selectedWorkId,
                setSelectedWorkType,
                setSelectedWorkId,
                projectId,
                setProjectId,
            }}
        >
            {children}
        </WorkSelectionContext.Provider>
    );
};
