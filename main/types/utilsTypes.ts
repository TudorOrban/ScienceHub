import { WorkspaceGeneralSearchContextType } from "@/contexts/search-contexts/workspace/WorkspaceGeneralSearchContext";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ProjectLayout, MediumProjectCard } from "./projectTypes";
import { BrowseProjectsSearchContextType } from "@/contexts/search-contexts/browse/BrowseProjectsSearchContext";
import { BrowseWorksSearchContextType } from "@/contexts/search-contexts/browse/BrowseWorksSearchContext";
import { BrowseSubmissionsSearchContextType } from "@/contexts/search-contexts/browse/BrowseSubmissionsSearchContext";
import { BrowseReviewsSearchContextType } from "@/contexts/search-contexts/browse/BrowseReviewsSearchContext";
import { BrowseIssuesSearchContextType } from "@/contexts/search-contexts/browse/BrowseIssuesSearchContext";

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
// utils

// export type AllKeys = keyof MediumProjectCard | keyof ProjectLayout;

// export interface FullFeature<T> {
//     feature: Feature;
//     key?: AllKeys;
//     link?: string;
// }

// export interface Feature {
//     label: string;
//     icon?: IconDefinition;
//     color?: string;
// }


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