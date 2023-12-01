import { BrowseContextType } from "@/types/utilsTypes";
import {
    BrowseProjectsSearchContext,
    BrowseProjectsSearchContextType,
} from "@/app/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import {
    BrowseWorksSearchContext,
    BrowseWorksSearchContextType,
} from "@/app/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowsePeopleSearchContext } from "@/app/contexts/search-contexts/browse/BrowsePeopleSearchContext";
import {
    BrowseSubmissionsSearchContext,
    BrowseSubmissionsSearchContextType,
} from "@/app/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseDiscussionsSearchContext } from "@/app/contexts/search-contexts/browse/BrowseDiscussionsSearchContext";
import { useContext } from "react";
import { BrowseIssuesSearchContext, BrowseIssuesSearchContextType } from "@/app/contexts/search-contexts/browse/BrowseIssuesSearchContext";
import { BrowseReviewsSearchContext, BrowseReviewsSearchContextType } from "@/app/contexts/search-contexts/browse/BrowseReviewsSearchContext";

export const useBrowseSearchContext = (
    contextType: string | undefined
): BrowseContextType | undefined => {
    const browseProjectsSearchContext = useContext(BrowseProjectsSearchContext);
    const browseWorksSearchContext = useContext(BrowseWorksSearchContext);
    const browseSubmissionsSearchContext = useContext(
        BrowseSubmissionsSearchContext
    );
    const browseIssuesSearchContext = useContext(BrowseIssuesSearchContext);
    const browseReviewsSearchContext = useContext(BrowseReviewsSearchContext);
    const browseDiscussionsSearchContext = useContext(
        BrowseDiscussionsSearchContext
    );
    const browsePeopleSearchContext = useContext(BrowsePeopleSearchContext);

    switch (contextType) {
        case "Browse Projects":
            return browseProjectsSearchContext as BrowseProjectsSearchContextType;
        case "Browse Works":
            return browseWorksSearchContext as BrowseWorksSearchContextType;
        case "Browse Submissions":
            return browseSubmissionsSearchContext as BrowseSubmissionsSearchContextType;
        case "Browse Issues":
            return browseIssuesSearchContext as BrowseIssuesSearchContextType;
        case "Browse Reviews":
            return browseReviewsSearchContext as BrowseReviewsSearchContextType;
        // case "Browse Discussions":
        //     return browseDiscussionsSearchContext as Browse;
        // case "Browse People":
        //     return browsePeopleSearchContext;
        // default:
        //     return browsePeopleSearchContext;
    }
};
