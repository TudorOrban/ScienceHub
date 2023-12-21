"use client";

import { ProjectDelta, ProjectSubmission, ProjectSubmissionSmall } from '@/types/versionControlTypes';
import React, { useContext, useState } from 'react';


export type ProjectEditModeContextType = {
    isEditModeOn: boolean;
    projectId: number | undefined;
    projectName: string | undefined;
    projectSubmissions: ProjectSubmissionSmall[];
    selectedProjectSubmission: ProjectSubmission;
    selectedProjectSubmissionRefetch?: () => void;
    projectDeltaChanges: ProjectDelta;
    setIsEditModeOn: (isEditModeOn: boolean) => void;
    setProjectId: (projectId: number) => void;
    setProjectName: (projectName: string) => void;
    setProjectSubmissions: (projectSubmissions: ProjectSubmissionSmall[]) => void;
    setSelectedProjectSubmission: (selectedProjectSubmission: ProjectSubmission) => void;
    setSelectedProjectSubmissionRefetch: (selectedProjectSubmissionRefetch: () => void) => void;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
};

export const ProjectEditModeContext = React.createContext<ProjectEditModeContextType | undefined>(
    undefined
);

export const useProjectEditModeContext = (): ProjectEditModeContextType => {
    const context = useContext(ProjectEditModeContext);
    if (!context) {
        throw new Error("Please use ProjectEditModeContext within an ProjectEditModeContextProvider");
    };
    return context;
}

export const ProjectEditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEditModeOn, setIsEditModeOn] = useState(false);
    const [projectId, setProjectId] = useState<number>();
    const [projectName, setProjectName] = useState<string>();
    const [projectSubmissions, setProjectSubmissions] = useState<ProjectSubmissionSmall[]>([]);
    const [selectedProjectSubmission, setSelectedProjectSubmission] = useState<ProjectSubmission>({ id: 0, projectId: 0, initialProjectVersionId: 0, projectDelta: {} });
    const [selectedProjectSubmissionRefetch, setSelectedProjectSubmissionRefetch] = useState<() => void>();
    const [projectDeltaChanges, setProjectDeltaChanges] = useState<ProjectDelta>({});

    return (
        <ProjectEditModeContext.Provider
            value={{
                isEditModeOn,
                setIsEditModeOn,
                projectId,
                setProjectId,
                projectName,
                setProjectName,
                projectSubmissions,
                setProjectSubmissions,
                selectedProjectSubmission,
                setSelectedProjectSubmission,
                selectedProjectSubmissionRefetch,
                setSelectedProjectSubmissionRefetch,
                projectDeltaChanges,
                setProjectDeltaChanges
            }}
        >
            {children}
        </ProjectEditModeContext.Provider>
    );
};
