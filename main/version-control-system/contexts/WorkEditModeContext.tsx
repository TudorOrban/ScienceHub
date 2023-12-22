"use client";

import { WorkDelta, WorkSubmission, WorkSubmissionSmall } from '@/types/versionControlTypes';
import { WorkIdentifier } from '@/types/workTypes';
import React, { useContext, useState } from 'react';


export type WorkEditModeContextType = {
    isEditModeOn: boolean;
    workIdentifier: WorkIdentifier | undefined;
    workSubmissions: WorkSubmissionSmall[];
    selectedWorkSubmission: WorkSubmission;
    selectedWorkSubmissionRefetch?: () => void;
    workDeltaChanges: WorkDelta;
    projectId?: number;
    setIsEditModeOn: (isEditModeOn: boolean) => void;
    setWorkIdentifier: (workIdentifier: WorkIdentifier | undefined) => void;
    setWorkSubmissions: (workSubmissions: WorkSubmissionSmall[]) => void;
    setSelectedWorkSubmission: (selectedWorkSubmission: WorkSubmission) => void;
    setSelectedWorkSubmissionRefetch: (selectedWorkSubmissionRefetch: () => void) => void;
    setWorkDeltaChanges: (workDeltaChanges: WorkDelta) => void;
    setProjectId: (projectId: number | undefined) => void;
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
    const [isEditModeOn, setIsEditModeOn] = useState(false);
    const [workIdentifier, setWorkIdentifier] = useState<WorkIdentifier>();
    const [workSubmissions, setWorkSubmissions] = useState<WorkSubmissionSmall[]>([]);
    const [selectedWorkSubmission, setSelectedWorkSubmission] = useState<WorkSubmission>({ id: 0, workId: 0, workType: "", initialWorkVersionId: 0, workDelta: {} });
    const [selectedWorkSubmissionRefetch, setSelectedWorkSubmissionRefetch] = useState<() => void>();
    const [workDeltaChanges, setWorkDeltaChanges] = useState<WorkDelta>({});
    const [projectId, setProjectId] = useState<number | undefined>();

    return (
        <WorkEditModeContext.Provider
            value={{
                isEditModeOn,
                setIsEditModeOn,
                workIdentifier,
                setWorkIdentifier,
                workSubmissions,
                setWorkSubmissions,
                selectedWorkSubmission,
                setSelectedWorkSubmission,
                selectedWorkSubmissionRefetch,
                setSelectedWorkSubmissionRefetch,
                workDeltaChanges,
                setWorkDeltaChanges,
                projectId,
                setProjectId,
            }}
        >
            {children}
        </WorkEditModeContext.Provider>
    );
};
