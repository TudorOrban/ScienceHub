import { WorkspaceGeneralSearchContextType } from "@/src/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { BrowseProjectsSearchContextType } from "@/src/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import { BrowseWorksSearchContextType } from "@/src/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowseSubmissionsSearchContextType } from "@/src/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseReviewsSearchContextType } from "@/src/contexts/search-contexts/browse/BrowseReviewsSearchContext";
import { BrowseIssuesSearchContextType } from "@/src/contexts/search-contexts/browse/BrowseIssuesSearchContext";

// Input types

export type FilterType = Record<string, any>;

export type FetchBehavior = "all" | "count" | "none" | "fields";

export type FetchDataOptions = {
    selectFields?: string;
    relatedFields?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
};

export type CreateProjectDataInput = {
    title: string;
};

export type CreateExperimentInput = CreateProjectDataInput & {
    description?: string;
    methodology?: string;
    status?: string;
    public?: boolean;
    folderId?: number;
};

// Search
export interface SmallSearchOptions {
    extraFilters?: Record<string, any>;
    enabled?: boolean;
    context?: string;
    page?: number;
    itemsPerPage?: number;
    includeRefetch?: boolean;
}

export interface UseWorksSearchOptions {
    extraFilters?: Record<string, any>;
    enabled?: boolean;
    context?: string;
    page?: number;
    itemsPerPage?: number;
}

export type ContextType =
    | BrowseProjectsSearchContextType
    | BrowseWorksSearchContextType
    | WorkspaceGeneralSearchContextType;

export type BrowseContextType =
    | BrowseProjectsSearchContextType
    | BrowseWorksSearchContextType
    | BrowseSubmissionsSearchContextType
    | BrowseIssuesSearchContextType
    | BrowseReviewsSearchContextType
    // | BrowseDiscussionsSearchContextType
    // | BrowsePeopleSearchContextType


export type ComparisonFilter = {
    greaterThan?: boolean;
    value: any;
    filterType?: "date" | "metric";
};

// -- New Search Types
export interface SmallSearchOptionsNew {
    entityId?: string;
    searchMode?: SearchMode;
    enabled?: boolean;
    page?: number;
    itemsPerPage?: number;
    searchQuery?: string;
    sortBy?: string;
    sortDescending?: boolean;
}

export enum SearchMode {
    USER,
    SECONDARY
}

// Plans
export interface Plan {
    id: number;
    startingAtDate: string;
    endingAtDate: string;
    title?: string;
    description?: string;
    tags?: string[];
    // linkedObjects: 
    public?: boolean;
    lane?: number;
    color?: string;
}