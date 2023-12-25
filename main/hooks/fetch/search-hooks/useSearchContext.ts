import { HeaderSearchContext } from "@/contexts/search-contexts/HeaderSearchContext";
import { ProjectGeneralSearchContext } from "@/contexts/search-contexts/ProjectGeneralContext";
import { WorkspaceGeneralSearchContext } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { ContextType } from "@/types/utilsTypes";
import { useContext } from "react";
import { SidebarSearchContext } from "@/contexts/search-contexts/SidebarSearchContext";
import { FallbackSearchContext } from "@/contexts/search-contexts/FallbackSearchContext";
import { ReusableSearchContext } from "@/contexts/search-contexts/ReusableSearchContext";

export const useSearchContext = (
    contextType: string | undefined
): ContextType | undefined => {
    switch (contextType) {
        case "Header":
            return useContext(HeaderSearchContext);
        case "Sidebar":
            return useContext(SidebarSearchContext);
        case "Workspace General":
            return useContext(
                WorkspaceGeneralSearchContext
            );;
        case "Project General":
            return useContext(ProjectGeneralSearchContext);
        case "Reusable":
            return useContext(ReusableSearchContext);
        case "Fallback":
            return useContext(FallbackSearchContext);
        default:
            return useContext(FallbackSearchContext);
    }
};
