"use client";

import React, { useContext } from "react";

export type WorkSubmissionSelectionContextType = {
    selectedWorkSubmissionId: number;
    setSelectedWorkSubmissionId: React.Dispatch<React.SetStateAction<number>>;
};

export const WorkSubmissionSelectionContext = React.createContext<
    WorkSubmissionSelectionContextType | undefined
>(undefined);

export const useWorkSubmissionSelectionContext = (): WorkSubmissionSelectionContextType => {
    const context = useContext(WorkSubmissionSelectionContext);
    if (!context) {
        throw new Error(
            "Please use WorkSubmissionSelectionContext within an WorkSubmissionSelectionContextProvider"
        );
    }
    return context;
};

export const WorkSubmissionSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [selectedWorkSubmissionId, setSelectedWorkSubmissionId] =
        React.useState<number>(0);

    return (
        <WorkSubmissionSelectionContext.Provider
            value={{
                selectedWorkSubmissionId,
                setSelectedWorkSubmissionId,
            }}
        >
            {children}
        </WorkSubmissionSelectionContext.Provider>
    );
};
