import { Team } from "./communityTypes";
import { Issue, Review } from "./managementTypes";
import { User } from "./userTypes";
import { ProjectSubmission, ProjectVersion, WorkSubmission } from "./versionControlTypes";
import { Experiment, Dataset, DataAnalysis, AIModel, CodeBlock, Paper, Citation, Folder, File, ExperimentSmall, DatasetSmall, DataAnalysisSmall, CodeBlockSmall, AIModelSmall, PaperSmall } from "./workTypes";

export interface Project {
    //all project data; not yet used
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
    experiments?: Experiment[];
    datasets?: Dataset[];
    dataAnalyses?: DataAnalysis[];
    codeBlocks?: CodeBlock[];
    aiModels?: AIModel[];
    papers?: Paper[];
    projectVersions?: ProjectVersion[];
    currentVersionId?: number;
    projectSubmissions?: ProjectSubmission[];
    totalCitations?: Citation[];
    hIndex?: number;
    researchScore?: number;
    license?: string;
    public?: boolean;
}

// export interface Work {
//     id: number;
//     createdAt: string;
//     updatedAt?: string;
//     title?: string;
//     description?: string;
//     users: User[];
// }
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
    currentProjectVersion?: number;
    projectSubmissions?: ProjectSubmission[];
    projectIssues?: Issue[];
    projectReviews?: Review[];
    researchScore?: number;
    hIndex?: number;
    totalProjectCitationsCount?: number;
    totalCitationsCount?: number;
    totalCitations?: Citation[];
    // projectViews?: ProjectView[];
    // projectUpvotes?: ProjectUpvote[];
    // projectShares?: ProjectShare[];
    projectViews?: { count: number }[];
    projectUpvotes?: { count: number }[];
    projectShares?: { count: number }[];
    doi?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
    public?: boolean;
}

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
}

export interface ProjectSmall {
    id: number;
    title: string;
    name: string;
}

export interface ProjectMetadata {
    doi?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
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