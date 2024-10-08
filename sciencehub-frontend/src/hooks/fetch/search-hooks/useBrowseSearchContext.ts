import { BrowseContextType } from "@/src/types/utilsTypes";
import {
    BrowseProjectsSearchContext,
    BrowseProjectsSearchContextType,
} from "@/src/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import {
    BrowseWorksSearchContext,
    BrowseWorksSearchContextType,
} from "@/src/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowsePeopleSearchContext } from "@/src/contexts/search-contexts/browse/BrowsePeopleSearchContext";
import {
    BrowseSubmissionsSearchContext,
    BrowseSubmissionsSearchContextType,
} from "@/src/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseDiscussionsSearchContext } from "@/src/contexts/search-contexts/browse/BrowseDiscussionsSearchContext";
import { useContext } from "react";
import {
    BrowseIssuesSearchContext,
    BrowseIssuesSearchContextType,
} from "@/src/contexts/search-contexts/browse/BrowseIssuesSearchContext";
import {
    BrowseReviewsSearchContext,
    BrowseReviewsSearchContextType,
} from "@/src/contexts/search-contexts/browse/BrowseReviewsSearchContext";
import { FallbackSearchContext } from "@/src/contexts/search-contexts/FallbackSearchContext";

/**
 * Util hook returning a Browse context depending on the specified context string
 */
export const useBrowseSearchContext = (
    contextType: string | undefined
): BrowseContextType | undefined => {
    switch (contextType) {
        case "Browse Projects":
            return useContext(BrowseProjectsSearchContext) as BrowseProjectsSearchContextType;
        case "Browse Works":
            return useContext(BrowseWorksSearchContext) as BrowseWorksSearchContextType;
        case "Browse Submissions":
            return useContext(BrowseSubmissionsSearchContext) as BrowseSubmissionsSearchContextType;
        case "Browse Issues":
            return useContext(BrowseIssuesSearchContext) as BrowseIssuesSearchContextType;
        case "Browse Reviews":
            return useContext(BrowseReviewsSearchContext) as BrowseReviewsSearchContextType;
        // case "Browse Discussions":
        //     return browseDiscussionsSearchContext as Browse;
        // case "Browse People":
        //     return browsePeopleSearchContext;
        default:
            return useContext(FallbackSearchContext) as BrowseContextType;
    }
};
