import { SnakeCaseObject } from "@/services/fetch/fetchGeneralDataAdvanced";
import { ProjectSmall } from "./projectTypes";
import { User } from "./userTypes";
import { Team } from "./communityTypes";

export type WorkType = "Experiment" | "Dataset" | "Data Analysis" | "AI Model" | "Code Block" | "Paper";
export type WorkKey = keyof Work;
export type WorkSnakeCaseKey = keyof SnakeCaseObject<Work>;
export type WorkMetadataSnakeCaseKey = keyof SnakeCaseObject<WorkMetadata>;


export type WorkIdentifier = {
    workId: string;
    workType: string;
}
export interface WorkSmallBase {
    id: number;
    title: string;
    projectId?: number;
    projects?: ProjectSmall[];
    folderId?: number;
}

export interface ExperimentSmall extends WorkSmallBase {
    workType: "Experiment";
}

export interface DatasetSmall extends WorkSmallBase {
    workType: "Dataset";
}

export interface DataAnalysisSmall extends WorkSmallBase {
    workType: "Data Analysis";
}

export interface AIModelSmall extends WorkSmallBase {
    workType: "AI Model";
}

export interface CodeBlockSmall extends WorkSmallBase {
    workType: "Code Block";
}

export interface PaperSmall extends WorkSmallBase {
    workType: "Paper";
}

export type WorkSmall = ExperimentSmall | DatasetSmall | DataAnalysisSmall | AIModelSmall | CodeBlockSmall | PaperSmall;


export interface WorkBase {
    id: number;
    projectId?: number;
    folderId?: number;
    projects?: ProjectSmall[];
    users?: User[];
    teams?: Team[];
    currentWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    title: string;
    description?: string;
    fileLocation?: FileLocation;
    // Metadata
    workMetadata?: WorkMetadata;
    fieldsOfResearch?: string[];
    notes?: string[];
    status?: string;
    // Metrics
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    citations?: Citation[];
    views?: { count: number }[];
    upvotes?: { count: number }[];
    shares?: { count: number }[];
    // Editor fields
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    // Visibility
    public?: boolean;
    submitted?: boolean;
}

export interface WorkMetadata {
    // doi?: string;
    license?: string;
    publisher?: string;
    conference?: string;
    researchGrants?: string[];
    tags?: string[];
    keywords?: string[];
};

export interface Experiment extends WorkBase {
    workType: "Experiment";
    objective?: string;
    hypothesis?: string;
    methodology?: string;
}

export interface Dataset extends WorkBase {
    workType: "Dataset";
}

export interface DataAnalysis extends WorkBase {
    workType: "Data Analysis";
}

export interface AIModel extends WorkBase {
    workType: "AI Model";
}

export interface CodeBlock extends WorkBase {
    workType: "Code Block";
}

export interface Paper extends WorkBase {
    workType: "Paper";
    abstract?: string;
}

export type Work =
    | Experiment
    | Dataset
    | DataAnalysis
    | AIModel
    | CodeBlock
    | Paper;

// Bucket file
export interface FileLocation {
    filename: string;
    bucketFilename: string;
    fileType?: string;
    fileSubtype?: string;
}

// Folders and files
export type FolderContent = Folder | File | WorkSmall;

export interface Folder {
    id: number;
    parentId?: number;
    projectId?: number;
    createdAt: string;
    updatedAt?: string;
    name: string;
    type?: string;
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    contents?: FolderContent[];
}

export interface File {
    id: number;
    projectId?: number;
    folderId?: number;
    itemType?: string;
    fileType?: string;
    createdAt: string;
    updatedAt?: string;
    name: string;
    type?: string;
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    content?: string;
}


// Other
export interface UserAllWorksSmall {
    id: string;
    username: string;
    fullName: string;
    experiments: ExperimentSmall[];
    datasets: DatasetSmall[];
    dataAnalyses: DataAnalysisSmall[];
    aiModels: AIModelSmall[];
    codeBlocks: CodeBlockSmall[];
    papers: PaperSmall[];
}
    
export interface WorksData {
    experiments: Experiment[];
    datasets: Dataset[];
    dataAnalyses: DataAnalysis[];
    aiModels: AIModel[];
    codeBlocks: CodeBlock[];
    papers: Paper[];
}

// Utils
export interface Methodology {
    controlGroups: string;
    randomization: string;
    variables: string;
    materials: string;
    dataCollection: string;
    sampleSelection: string;
}


export interface Citation {
    id: number;
    createdAt: number;
    sourceObjectId: number;
    sourceObjectType: string;
    targetObjectId: number;
    targetObjectType: string;
}

