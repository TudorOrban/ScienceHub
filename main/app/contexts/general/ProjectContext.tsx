"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

export type ProjectContextType = {
    identifier: string | null;
    projectName: string | null;
    setIdentifier: (identifier: string | null) => void;
    setProjectName: (projectName: string | null) => void;
};

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProject = (): ProjectContextType => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject must be used within a ProjectProvider");
    }
    return context;
};

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [identifier, setIdentifier] = useState<string | null>(null);
    const [projectName, setProjectName] = useState<string | null>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams.toString();

        const parts = url.split("/");
        const newIdentifier = parts[1];
        const newProjectName = parts[3];
        setIdentifier(newIdentifier);
        setProjectName(newProjectName);
    }, [pathname, searchParams]);

    return (
        <ProjectContext.Provider
            value={{ identifier, setIdentifier, projectName, setProjectName }}
        >
            {children}
        </ProjectContext.Provider>
    );
};
