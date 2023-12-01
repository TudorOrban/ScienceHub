// Body.tsx
"use client";

import React from "react";
import { BrowseProjectsSearchProvider } from "@/app/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import { WorkspaceGeneralSearchProvider } from "@/app/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { BrowsePeopleSearchProvider } from "@/app/contexts/search-contexts/browse/BrowsePeopleSearchContext";
import { BrowseSubmissionsSearchProvider } from "@/app/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseWorksSearchProvider } from "@/app/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowseDiscussionsSearchProvider } from "@/app/contexts/search-contexts/browse/BrowseDiscussionsSearchContext";
import { BrowseIssuesSearchProvider } from "@/app/contexts/search-contexts/browse/BrowseIssuesSearchContext";
import { BrowseReviewsSearchProvider } from "@/app/contexts/search-contexts/browse/BrowseReviewsSearchContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <BrowseProjectsSearchProvider>
                <BrowseWorksSearchProvider>
                    <BrowseSubmissionsSearchProvider>
                        <BrowseIssuesSearchProvider>
                            <BrowseReviewsSearchProvider>
                                <BrowseDiscussionsSearchProvider>
                                    <BrowsePeopleSearchProvider>
                                        <WorkspaceGeneralSearchProvider>
                                            {children}
                                        </WorkspaceGeneralSearchProvider>
                                    </BrowsePeopleSearchProvider>
                                </BrowseDiscussionsSearchProvider>
                            </BrowseReviewsSearchProvider>
                        </BrowseIssuesSearchProvider>
                    </BrowseSubmissionsSearchProvider>
                </BrowseWorksSearchProvider>
            </BrowseProjectsSearchProvider>
        </div>
    );
}
