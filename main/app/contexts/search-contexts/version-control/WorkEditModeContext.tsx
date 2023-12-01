"use client";

import React, { useContext } from 'react';

export enum WorkType {
    Experiment = 'Experiment',
    Dataset = 'Dataset',
    Paper = 'Paper',
    // ...other types
}

export type WorkEditModeContextType = {
    isEditModeOn: boolean;
    workId: number | null;
    workType: WorkType | null;
    toggleEditMode: () => void;
    setWorkId: React.Dispatch<React.SetStateAction<number | null>>;
    setWorkType: React.Dispatch<React.SetStateAction<WorkType | null>>;
};

export const WorkEditModeContext = React.createContext<WorkEditModeContextType | undefined>(
    undefined
);

export const useWorkEditModeContext = (): WorkEditModeContextType => {
    const context = useContext(WorkEditModeContext);
    if (!context) {
        throw new Error("Please use WorkEditModeContext within an WorkEditModeContextProvider");
    };
    return context;
}

export const WorkEditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEditModeOn, setEditMode] = React.useState(false);
    const [workId, setWorkId] = React.useState<number | null>(null);
    const [workType, setWorkType] = React.useState<WorkType | null>(null);

    const toggleEditMode = () => {
        setEditMode(!isEditModeOn);
    };

    return (
        <WorkEditModeContext.Provider
            value={{
                isEditModeOn,
                workId,
                workType,
                toggleEditMode,
                setWorkId,
                setWorkType
            }}
        >
            {children}
        </WorkEditModeContext.Provider>
    );
};
