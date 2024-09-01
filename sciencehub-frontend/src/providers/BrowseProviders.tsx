// Body.tsx
"use client";

import React from "react";
import { BrowseProjectsSearchProvider } from "@/src/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import { WorkspaceGeneralSearchProvider } from "@/src/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { BrowsePeopleSearchProvider } from "@/src/contexts/search-contexts/browse/BrowsePeopleSearchContext";
import { BrowseSubmissionsSearchProvider } from "@/src/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseWorksSearchProvider } from "@/src/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowseDiscussionsSearchProvider } from "@/src/contexts/search-contexts/browse/BrowseDiscussionsSearchContext";
import { BrowseIssuesSearchProvider } from "@/src/contexts/search-contexts/browse/BrowseIssuesSearchContext";
import { BrowseReviewsSearchProvider } from "@/src/contexts/search-contexts/browse/BrowseReviewsSearchContext";

/**
 * Providers for the Browse pages contexts
 */
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
