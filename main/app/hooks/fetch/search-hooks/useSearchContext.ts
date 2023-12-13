import { HeaderSearchContext } from "@/app/contexts/search-contexts/HeaderSearchContext";
import { ProjectGeneralSearchContext } from "@/app/contexts/search-contexts/ProjectGeneralContext";
import { WorkspaceGeneralSearchContext } from "@/app/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { ContextType } from "@/types/utilsTypes";
import { BrowseProjectsSearchContext } from "@/app/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import { BrowseWorksSearchContext } from "@/app/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowsePeopleSearchContext } from "@/app/contexts/search-contexts/browse/BrowsePeopleSearchContext";
import { BrowseSubmissionsSearchContext } from "@/app/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseDiscussionsSearchContext } from "@/app/contexts/search-contexts/browse/BrowseDiscussionsSearchContext";
import { useContext } from "react";
import { SidebarSearchContext } from "@/app/contexts/search-contexts/SidebarSearchContext";
import { FallbackSearchContext } from "@/app/contexts/search-contexts/FallbackSearchContext";
import { ReusableSearchContext } from "@/app/contexts/search-contexts/ReusableSearchContext";

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
