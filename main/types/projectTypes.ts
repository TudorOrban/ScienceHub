import { SnakeCaseObject } from "@/services/fetch/fetchGeneralDataAdvanced";
import { Team } from "./communityTypes";
import { ProjectIssue, ProjectReview } from "./managementTypes";
import { User } from "./userTypes";
import { ProjectSubmission, ProjectVersion } from "./versionControlTypes";
import { Citation, Folder, File, ExperimentSmall, DatasetSmall, DataAnalysisSmall, CodeBlockSmall, AIModelSmall, PaperSmall } from "./workTypes";


export interface ProjectSmall {
    id: number;
    title: string;
    name: string;
    link?: string;
}

export interface ProjectMedium {
    id: number;
    title: string;
    name: string;
    currentProjectVersionId?: number;
    users?: User[];
    teams?: Team[];
    link?: string;
}

export interface ProjectSearchDTO {
    id: number;
    title: string;
    name: string;
    currentProjectVersionId?: number;
    users?: User[];
    teams?: Team[];
    link?: string;
}

export interface ProjectLayout {
    id: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    name?: string;
    description?: string;
    users?: User[];
    teams?: Team[];
    folders?: Folder[];
    files?: File[];
    experiments?: ExperimentSmall[];
    datasets?: DatasetSmall[];
    dataAnalyses?: DataAnalysisSmall[];
    codeBlocks?: CodeBlockSmall[];
    aiModels?: AIModelSmall[];
    papers?: PaperSmall[];
    projectVersions?: ProjectVersion[];
    currentProjectVersionId?: number;
    projectSubmissions?: ProjectSubmission[];
    projectIssues?: ProjectIssue[];
    projectReviews?: ProjectReview[];
    researchScore?: number;
    hIndex?: number;
    totalProjectCitationsCount?: number;
    totalCitationsCount?: number;
    totalCitations?: Citation[];
    projectViews?: { count: number }[];
    projectUpvotes?: { count: number }[];
    projectShares?: { count: number }[];
    projectMetadata?: ProjectMetadata;
    fieldsOfResearch?: string[];
    public?: boolean;
    link?: string;
}

export type ProjectLayoutKey = keyof ProjectLayout;
export type ProjectMetadataKey = keyof ProjectMetadata;
export type ProjectLayoutSnakeCaseKey = keyof SnakeCaseObject<ProjectLayout>;
export type ProjectMetadataSnakeCaseKey = keyof SnakeCaseObject<ProjectMetadata>;

export interface MediumProjectCard {
    id: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    name?: string;
    description?: string;
    users?: User[];
    teams?: Team[];
    filesCount?: number;
    experimentsCount?: number;
    datasetsCount?: number;
    dataAnalysesCount?: number;
    aiModelsCount?: number;
    papersCount?: number;
    codeBlocksCount?: number;
    projectSubmissionsCount?: number;
    projectSubmissionsRequestsCount?: number;
    projectIssuesCount?: number;
    projectReviewsCount?: number;
    mergesCount?: number;
    researchScore?: number;
    hIndex?: number;
    totalProjectCitationsCount?: number;
    totalCitationsCount?: number;
    public?: boolean;
    link?: string;
}


export interface ProjectMetadata {
    doi?: string;
    license?: string;
    publisher?: string;
    conference?: string;
    researchGrants?: string[];
    tags?: string[];
    keywords?: string[];
};


export interface DirectoryItem {
    id: number;
    title: string;
    itemType: string;
    isModified?: boolean;
    isNew?: boolean;
    subItems: DirectoryItem[];
};

export interface ProjectDirectory {
    items: DirectoryItem[];
    currentProjectVersion?: number;
};

// Create project
export interface CreateProjectInput {
    id: number;
    title?: string;
    name?: string;
    description?: string;
    users?: User[];
    teams?: Team[];
    public?: boolean;
}


// Utils
export interface UserAllProjectsSmall {
    id: string;
    username: string;
    fullName: string;
    projects: ProjectSmall[];
}

// export interface ProjectView {
//     projectId: number;
//     viewingUserId: number;
//     createdAt: string;
// }

// export interface ProjectUpvote {
//     projectId: number;
//     upvotingUserId: number;
//     createdAt: string;
// }

// export interface ProjectShare {
//     projectId: number;
//     sharingUserId: number;
//     createdAt: string;
// }