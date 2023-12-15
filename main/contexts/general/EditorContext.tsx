"use client";

import { ProjectDirectory, ProjectSmall } from '@/types/projectTypes';
import { ProjectSubmissionSmall, WorkSubmission } from '@/types/versionControlTypes';
import { Work, WorkIdentifier } from '@/types/workTypes';
import React, { useContext, useState } from 'react';

export type EditorContextType = {
    initializedEditor: boolean; 
    openedProject: ProjectSmall | undefined;
    projectDirectory: ProjectDirectory | undefined;
    activeWindows: number[];
    openedWorkIdentifiers: Record<number, Record<number, WorkIdentifier>> | undefined;
    openedWorks: Record<number, Record<number, Work>> | undefined;
    currentWindow: number;
    currentWork: Record<number, number>;
    projectSubmissions: ProjectSubmissionSmall[] | undefined;
    selectedSubmission?: ProjectSubmissionSmall | undefined;
    workSubmissions: WorkSubmission[] | undefined;
    setInitializedEditor: (initializeEditor: boolean) => void;
    setOpenedProject: (project: ProjectSmall | undefined) => void;
    setProjectDirectory: (project: ProjectDirectory | undefined) => void;
    setActiveWindows: (window: number[]) => void;
    setOpenedWorkIdentifiers: (workIdentifiers: Record<number, Record<number, WorkIdentifier>> | undefined) => void;
    setOpenedWorks: (works: Record<number, Record<number, Work>> | undefined) => void;
    setCurrentWindow: (Window: number) => void;
    setCurrentWork: (work: Record<number, number>) => void;
    setProjectSubmissions: (projectSubmissions: ProjectSubmissionSmall[]) => void;
    setSelectedSubmission: (submission: ProjectSubmissionSmall | undefined) => void; 
    setWorkSubmissions: (workSubmissions: WorkSubmission[] | undefined) => void;
};

export const EditorContext = React.createContext<EditorContextType | undefined>(
    undefined
);

export const useEditorContext = (): EditorContextType => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("Please use EditorContext within an EditorContextProvider");
    };
    return context;
}

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [initializedEditor, setInitializedEditor] = useState<boolean>(false);
    const [openedProject, setOpenedProject] = useState<
        ProjectSmall | undefined
    >();
    const [projectDirectory, setProjectDirectory] = useState<
        ProjectDirectory | undefined
    >();

    const [activeWindows, setActiveWindows] = useState<number[]>([]);
    const [openedWorks, setOpenedWorks] = useState<
        Record<number, Record<number, Work>>
    >();
    const [openedWorkIdentifiers, setOpenedWorkIdentifiers] = useState<
        Record<number, Record<number, WorkIdentifier>>
    >();

    const [currentWindow, setCurrentWindow] = useState<number>(1);
    const [currentWork, setCurrentWork] = useState<Record<number, number>>({ 1: 0 });
    const [projectSubmissions, setProjectSubmissions] = useState<ProjectSubmissionSmall[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmissionSmall>();
    const [workSubmissions, setWorkSubmissions] = useState<WorkSubmission[]>();
    
    return (
        <EditorContext.Provider
            value={{
                initializedEditor,
                setInitializedEditor,
                openedProject,
                setOpenedProject,
                projectDirectory,
                setProjectDirectory,
                activeWindows,
                setActiveWindows,
                openedWorkIdentifiers,
                setOpenedWorkIdentifiers,
                openedWorks,
                setOpenedWorks,
                currentWindow,
                setCurrentWindow,
                currentWork,
                setCurrentWork,
                projectSubmissions,
                setProjectSubmissions,
                selectedSubmission,
                setSelectedSubmission,
                workSubmissions,
                setWorkSubmissions,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};
