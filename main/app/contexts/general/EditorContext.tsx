"use client";

import { SelectOption } from '@/components/light-simple-elements/Select';
import { ProjectDirectory, ProjectLayout, ProjectSmall } from '@/types/projectTypes';
import { Work } from '@/types/workTypes';
import React, { useContext, useState } from 'react';

export type EditorContextType = {
    activeWindows: number[];
    openedProject: ProjectSmall | undefined;
    projectDirectory: ProjectDirectory | undefined;
    openedWorks: Record<number, Record<number, Work>>;
    currentWindow: number;
    currentWork: Record<number, number>;
    selectedSubmission?: SelectOption;
    setActiveWindows: (window: number[]) => void;
    setOpenedProject: (project: ProjectSmall) => void;
    setProjectDirectory: (project: ProjectDirectory) => void;
    setOpenedWorks: (works: Record<number, Record<number, Work>>) => void;
    setCurrentWindow: (Window: number) => void;
    setCurrentWork: (work: Record<number, number>) => void;
    setSelectedSubmission: (submission: SelectOption) => void; 
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
    const [activeWindows, setActiveWindows] = useState<number[]>([1]);

    const [openedProject, setOpenedProject] = useState<
        ProjectSmall | undefined
    >();
    const [projectDirectory, setProjectDirectory] = useState<
        ProjectDirectory | undefined
    >();

    const [openedWorks, setOpenedWorks] = useState<
        Record<number, Record<number, Work>>
    >({
        1: {
            1: {
                id: 1,
                title: "Test1toseeifworking",
                description: "This is a test.",
                workType: "Experiment",
            },
            2: {
                id: 2,
                title: "Test2",
                description: "This is asdad test.",
                workType: "Dataset",
            },
            3: {
                id: 3,
                title: "Test3",
                description: "This ieqwewqeweqweqws a test.",
                workType: "Data Analysis",
            },
            4: {
                id: 4,
                title: "Testeqw4",
                description: "This ieqwewqeoweqweqws a test.",
                workType: "AI Model",
            },
            5: {
                id: 5,
                title: "Test5qw",
                description: "This ieoweqweqws a test.",
                workType: "Data Analysis",
            },
            6: {
                id: 6,
                title: "Testwqew6",
                description: "This ieqwewqewowkeqoekopeqweqws a test.",
                workType: "Code Block",
            },
        },
    });

    const [currentWindow, setCurrentWindow] = useState<number>(1);
    const [currentWork, setCurrentWork] = useState<Record<number, number>>({ 1: 1 });
    const [selectedSubmission, setSelectedSubmission] = useState<SelectOption>();
    
    return (
        <EditorContext.Provider
            value={{
                activeWindows,
                setActiveWindows,
                openedProject,
                setOpenedProject,
                projectDirectory,
                setProjectDirectory,
                openedWorks,
                setOpenedWorks,
                currentWindow,
                setCurrentWindow,
                currentWork,
                setCurrentWork,
                selectedSubmission,
                setSelectedSubmission,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};
