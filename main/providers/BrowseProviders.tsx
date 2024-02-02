// Body.tsx
"use client";

import React from "react";
import { BrowseProjectsSearchProvider } from "@/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import { WorkspaceGeneralSearchProvider } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { BrowsePeopleSearchProvider } from "@/contexts/search-contexts/browse/BrowsePeopleSearchContext";
import { BrowseSubmissionsSearchProvider } from "@/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseWorksSearchProvider } from "@/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowseDiscussionsSearchProvider } from "@/contexts/search-contexts/browse/BrowseDiscussionsSearchContext";
import { BrowseIssuesSearchProvider } from "@/contexts/search-contexts/browse/BrowseIssuesSearchContext";
import { BrowseReviewsSearchProvider } from "@/contexts/search-contexts/browse/BrowseReviewsSearchContext";

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
