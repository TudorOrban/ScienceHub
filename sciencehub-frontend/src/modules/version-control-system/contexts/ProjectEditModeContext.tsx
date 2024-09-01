"use client";

import {
    ProjectDelta,
    ProjectSubmission,
    ProjectSubmissionSmall,
    WorkSubmission,
} from "@/src/types/versionControlTypes";
import { WorkIdentifier } from "@/src/types/workTypes";
import React, { useContext, useState } from "react";

export type ProjectEditModeContextType = {
    isProjectEditModeOn: boolean;
    projectId: number | undefined;
    projectName: string | undefined;
    projectSubmissions: ProjectSubmissionSmall[];
    selectedProjectSubmission: ProjectSubmission;
    selectedProjectSubmissionRefetch?: () => void;
    projectDeltaChanges: ProjectDelta;
    workIdentifier?: WorkIdentifier;
    selectedProjectWorkSubmission?: WorkSubmission;
    setIsProjectEditModeOn: (isProjectEditModeOn: boolean) => void;
    setProjectId: (projectId: number) => void;
    setProjectName: (projectName: string) => void;
    setProjectSubmissions: (projectSubmissions: ProjectSubmissionSmall[]) => void;
    setSelectedProjectSubmission: (selectedProjectSubmission: ProjectSubmission) => void;
    setSelectedProjectSubmissionRefetch: (selectedProjectSubmissionRefetch: () => void) => void;
    setProjectDeltaChanges: (projectDeltaChanges: ProjectDelta) => void;
    setWorkIdentifier: (workIdentifier: WorkIdentifier) => void;
    setSelectedProjectWorkSubmission: (selectedWorkSubmission: WorkSubmission) => void;
};

/**
 * Context for the Project Edit Mode, holding selected submission, current delta changes etc.
 */
export const ProjectEditModeContext = React.createContext<ProjectEditModeContextType | undefined>(
    undefined
);

export const useProjectEditModeContext = (): ProjectEditModeContextType => {
    const context = useContext(ProjectEditModeContext);
    if (!context) {
        throw new Error(
            "Please use ProjectEditModeContext within an ProjectEditModeContextProvider"
        );
    }
    return context;
};

export const ProjectEditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isProjectEditModeOn, setIsProjectEditModeOn] = useState(false);
    const [projectId, setProjectId] = useState<number>();
    const [projectName, setProjectName] = useState<string>();
    const [projectSubmissions, setProjectSubmissions] = useState<ProjectSubmissionSmall[]>([]);
    const [selectedProjectSubmission, setSelectedProjectSubmission] = useState<ProjectSubmission>({
        id: 0,
        projectId: 0,
        initialProjectVersionId: 0,
        projectDelta: {},
    });
    const [selectedProjectWorkSubmission, setSelectedProjectWorkSubmission] =
        useState<WorkSubmission>({
            id: 0,
            workId: 0,
            workType: "",
            initialWorkVersionId: 0,
            workDelta: {},
        });
    const [selectedProjectSubmissionRefetch, setSelectedProjectSubmissionRefetch] =
        useState<() => void>();
    const [projectDeltaChanges, setProjectDeltaChanges] = useState<ProjectDelta>({});
    const [workIdentifier, setWorkIdentifier] = useState<WorkIdentifier>({
        workId: "",
        workType: "",
    });

    return (
        <ProjectEditModeContext.Provider
            value={{
                isProjectEditModeOn,
                setIsProjectEditModeOn,
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
                setProjectDeltaChanges,
                workIdentifier,
                setWorkIdentifier,
                selectedProjectWorkSubmission,
                setSelectedProjectWorkSubmission,
            }}
        >
            {children}
        </ProjectEditModeContext.Provider>
    );
};
