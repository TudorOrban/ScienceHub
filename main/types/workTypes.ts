import { ProjectSmall } from "./projectTypes";
import { User } from "./userTypes";

export type Work =
    | Experiment
    | Dataset
    | DataAnalysis
    | AIModel
    | CodeBlock
    | Paper;
    
export type WorkIdentifier = {
    workId: string;
    workType: string;
}
export interface WorkSmall {
    id: number;
    title: string;
    workType?: string;
    projectId?: number;
}

export interface WorksSmall {
    works: WorkSmall[];
}

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

export interface WorkMetadata {
    doi?: string;
    license?: string;
    publisher?: string;
    conference?: string;
    researchGrants?: string[];
    tags?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
};


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

export interface ExperimentSmall {
    id: number;
    title: string;
    projectId?: number;
    folderId?: number;
}

export interface Experiment {
    id: number;
    projectId?: number;
    folderId?: number;
    workType?: string;
    projects?: ProjectSmall[];
    users?: User[];
    currentWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    title: string;
    description?: string;
    objective?: string;
    hypothesis?: string;
    methodology?: Methodology;
    experimentPath?: string;
    pdfPath?: string;
    supplementaryMaterial?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
    status?: string;
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    citations?: Citation[];
    views?: { count: number }[];
    upvotes?: { count: number }[];
    shares?: { count: number }[];
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    public?: boolean;
}

export interface DatasetSmall {
    id: number;
    title: string;
    projectId?: number;
    folderId?: number;
}

export interface Dataset {
    id: number;
    projectId?: number;
    folderId?: number;
    workType?: string;
    projects?: ProjectSmall[];
    users?: User[];
    currentWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    title: string;
    description?: string;
    filePath?: string;
    datasetPath?: string;
    datasetLocation?: DatasetLocation;
    supplementaryMaterial?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
    status?: string;
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    citations?: Citation[];
    views?: { count: number }[];
    upvotes?: { count: number }[];
    shares?: { count: number }[];
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    public?: boolean;
}

export interface DataAnalysisSmall {
    id: number;
    title: string;
    projectId?: number;
    folderId?: number;
}

export interface DataAnalysis {
    id: number;
    projectId?: number;
    folderId?: number;
    workType?: string;
    projects?: ProjectSmall[];
    users?: User[];
    currentWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    title: string;
    description?: string;
    notebookPath?: string;
    supplementaryMaterial?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
    status?: string;
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    citations?: Citation[];
    views?: { count: number }[];
    upvotes?: { count: number }[];
    shares?: { count: number }[];
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    public?: boolean;
}

export interface AIModelSmall {
    id: number;
    title: string;
    projectId?: number;
    folderId?: number;
}

export interface AIModel {
    id: number;
    projectId?: number;
    folderId?: number;
    workType?: string;
    projects?: ProjectSmall[];
    users?: User[];
    currentWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    description?: string;
    modelPath?: string;
    supplementaryMaterial?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
    status?: string;
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    citations?: Citation[];
    views?: { count: number }[];
    upvotes?: { count: number }[];
    shares?: { count: number }[];
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    public?: boolean;
}

export interface CodeBlockSmall {
    id: number;
    title: string;
    projectId?: number;
    folderId?: number;
}

export interface CodeBlock {
    id: number;
    projectId?: number;
    folderId?: number;
    workType?: string;
    projects?: ProjectSmall[];
    users?: User[];
    currentWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    description?: string;
    code?: string;
    supplementaryMaterial?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
    status?: string;
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    citations?: Citation[];
    views?: { count: number }[];
    upvotes?: { count: number }[];
    shares?: { count: number }[];
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    public?: boolean;
}

export interface PaperSmall {
    id: number;
    title: string;
    projectId?: number;
    folderId?: number;
}

export interface Paper {
    id: number;
    projectId?: number;
    folderId?: number;
    workType?: string;
    projects?: ProjectSmall[];
    users?: User[];
    currentWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    description?: string;
    pdfPath?: string;
    supplementaryMaterial?: string;
    license?: string;
    researchGrants?: string[];
    keywords?: string[];
    fieldsOfResearch?: string[];
    status?: string;
    researchScore?: number;
    hIndex?: number;
    citationsCount?: number;
    citations?: Citation[];
    views?: { count: number }[];
    upvotes?: { count: number }[];
    shares?: { count: number }[];
    isModified?: boolean;
    isChanged?: boolean;
    isNew?: boolean;
    public?: boolean;
}



// Other


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


// Utils
export type FileLocation = DatasetLocation;
export interface DatasetLocation {
    datasetName: string;
    datasetType: string;
    bucketFilename: string;
    fileType?: string;
}