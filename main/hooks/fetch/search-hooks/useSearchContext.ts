import { HeaderSearchContext } from "@/contexts/search-contexts/HeaderSearchContext";
import { ProjectGeneralSearchContext } from "@/contexts/search-contexts/ProjectGeneralContext";
import { WorkspaceGeneralSearchContext } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { ContextType } from "@/types/utilsTypes";
import { BrowseProjectsSearchContext } from "@/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import { BrowseWorksSearchContext } from "@/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowsePeopleSearchContext } from "@/contexts/search-contexts/browse/BrowsePeopleSearchContext";
import { BrowseSubmissionsSearchContext } from "@/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseDiscussionsSearchContext } from "@/contexts/search-contexts/browse/BrowseDiscussionsSearchContext";
import { useContext } from "react";
import { SidebarSearchContext } from "@/contexts/search-contexts/SidebarSearchContext";
import { FallbackSearchContext } from "@/contexts/search-contexts/FallbackSearchContext";
import { ReusableSearchContext } from "@/contexts/search-contexts/ReusableSearchContext";

export const useSearchContext = (
    contextType: string | undefined
): ContextType | undefined => {
    const headerSearchContext = useContext(HeaderSearchContext);
    const sidebarSearchContext = useContext(SidebarSearchContext);
    const workspaceGeneralSearchContext = useContext(
        WorkspaceGeneralSearchContext
    );
    const projectGeneralSearchContext = useContext(ProjectGeneralSearchContext);
    const browseProjectsSearchContext = useContext(BrowseProjectsSearchContext);
    const browseWorksSearchContext = useContext(BrowseWorksSearchContext);
    const browseSubmissionsSearchContext = useContext(
        BrowseSubmissionsSearchContext
    );
    const browseDiscussionsSearchContext = useContext(
        BrowseDiscussionsSearchContext
    );
    const browsePeopleSearchContext = useContext(BrowsePeopleSearchContext);
    const reusableSearchContext = useContext(ReusableSearchContext);
    const fallbackSearchContext = useContext(FallbackSearchContext);

    switch (contextType) {
        case "Header":
            return headerSearchContext;
        case "Sidebar":
            return sidebarSearchContext;
        case "Workspace General":
            return workspaceGeneralSearchContext;
        case "Project General":
            return projectGeneralSearchContext;
        case "Browse Projects":
            return browseProjectsSearchContext;
        case "Browse Works":
            return browseWorksSearchContext;
        case "Browse Submissions":
            return browseSubmissionsSearchContext;
        case "Browse Discussions":
            return browseDiscussionsSearchContext;
        case "Browse People":
            return browsePeopleSearchContext;
        case "Reusable":
            return reusableSearchContext;
        case "Fallback":
        default:
            return fallbackSearchContext;
    }
};
