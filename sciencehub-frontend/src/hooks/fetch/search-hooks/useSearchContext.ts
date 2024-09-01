import { HeaderSearchContext } from "@/src/contexts/search-contexts/HeaderSearchContext";
import { ProjectGeneralSearchContext } from "@/src/contexts/search-contexts/ProjectGeneralContext";
import { WorkspaceGeneralSearchContext } from "@/src/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { ContextType } from "@/src/types/utilsTypes";
import { useContext } from "react";
import { SidebarSearchContext } from "@/src/contexts/search-contexts/SidebarSearchContext";
import { FallbackSearchContext } from "@/src/contexts/search-contexts/FallbackSearchContext";
import { ReusableSearchContext } from "@/src/contexts/search-contexts/ReusableSearchContext";

/**
 * Util hook returning a context depending on the specified context string.
 */
export const useSearchContext = (contextType: string | undefined): ContextType | undefined => {
    switch (contextType) {
        case "Header":
            return useContext(HeaderSearchContext);
        case "Sidebar":
            return useContext(SidebarSearchContext);
        case "Workspace General":
            return useContext(WorkspaceGeneralSearchContext);
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
