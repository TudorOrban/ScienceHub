"use client";

import React, { useContext } from "react";

export type ProjectSubmissionSelectionContextType = {
    selectedProjectSubmissionId: number;
    setSelectedProjectSubmissionId: React.Dispatch<React.SetStateAction<number>>;
};

export const ProjectSubmissionSelectionContext = React.createContext<
    ProjectSubmissionSelectionContextType | undefined
>(undefined);

export const useProjectSubmissionSelectionContext = (): ProjectSubmissionSelectionContextType => {
    const context = useContext(ProjectSubmissionSelectionContext);
    if (!context) {
        throw new Error(
            "Please use ProjectSubmissionSelectionContext within an ProjectSubmissionSelectionContextProvider"
        );
    }
    return context;
};

export const ProjectSubmissionSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [selectedProjectSubmissionId, setSelectedProjectSubmissionId] =
        React.useState<number>(0);

    return (
        <ProjectSubmissionSelectionContext.Provider
            value={{
                selectedProjectSubmissionId,
                setSelectedProjectSubmissionId,
            }}
        >
            {children}
        </ProjectSubmissionSelectionContext.Provider>
    );
};
