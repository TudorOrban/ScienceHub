// Version control

import { Team } from "./communityTypes";
import { ProjectLayout } from "./projectTypes";
import { User } from "./userTypes";
import { FileLocation, Methodology } from "./workTypes";

export interface ProjectSubmissionSmall {
    id: number;
    projectId: number;
    initialProjectVersionId?: number;
    finalProjectVersionId?: number;
    createdAt?: string;
    users?: User[];
    title?: string;
    status?: SubmissionStatus;
    public?: boolean;
}

export interface ProjectSubmission {
    id: number;
    projectId: number;
    initialProjectVersionId?: number;
    finalProjectVersionId?: number;
    createdAt?: string;
    users?: User[];
    title?: string;
    description?: string;
    status?: SubmissionStatus;
    public?: boolean;
    workSubmissions?: WorkSubmission[];
}

export interface WorkSubmissionSmall {
    id: number;
    workType: string;
    workId: number;
    initialWorkVersionId: number;
    finalWorkVersionId?: number;
    createdAt?: string;
    users?: User[];
    teams?: Team[];
    title?: string;
    description?: string;
    status?: SubmissionStatus;
    public?: boolean;
}

export interface WorkSubmission {
    id: number;
    workType: string;
    workId: number;
    initialWorkVersionId: number;
    finalWorkVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    users?: User[];
    teams?: Team[];
    title?: string;
    description?: string;
    status?: SubmissionStatus;
    public?: boolean;
    submittedData?: SubmittedData;
    acceptedData?: AcceptedData;
    workDelta?: WorkDelta;
}

export type SubmissionStatus = "In progress" | "Submitted" | "Accepted";
export interface SubmittedData {
    date?: string;
    users: User[];
}

export interface AcceptedData {
    date?: string;
    users: User[];
}

export type SubmissionSmall = ProjectSubmissionSmall | WorkSubmissionSmall;

export type Submission = ProjectSubmission | WorkSubmission;

export interface ProjectVersion {
    id: number;
    projectId: number;
    versionNumber: number;
    createdAt: string;
}

export interface WorkVersion {
    id: number;
    workType: string;
    workId: number;
    versionNumber: number;
    createdAt: string;
}

// export interface WorkVersions {
//     workVersions: WorkVersion[],
//     extraInfo?: string;
// }

export interface ProjectDelta {
    id: number;
    initialProjectVersionId?: number;
    finalProjectVersionId?: number;
    deltaData: DeltaData;
}

export type DeltaAction = "added" | "removed" | "modified";
// export type DeltaData = Record<string, { action: DeltaAction; value: any }>;
export type DeltaValue = { action: DeltaAction; value: any } | TextDiff[];

export type DeltaData = Record<string, DeltaValue>;

// Works deltas

export interface TextDiff {
    position: number;
    deleteCount: number;
    insert: string;
}

export interface ObjectDelta<T> {
    [key: string]: TextDiff[] | ObjectDelta<T> | undefined;
}

export interface WorkTextFieldsDiffs {
    title?: TextDiff[];
    description?: TextDiff[];
    supplementaryMaterial?: TextDiff[];
    license?: TextDiff[];
    grants?: TextDiff[];
    status?: TextDiff[];
    // public?: boolean;
};

export interface WorkDelta {
    // id?: number;
    // projectId?: number;
    // folderId?: number;
    // users?: User[];
    textDiffs: WorkTextFieldsDiffs;
    filesToBeRemoved?: FileLocation[];
    filesToBeAdded?: FileLocation[];
}

export interface MethodologyDelta extends ObjectDelta<Methodology> {
    controlGroups?: TextDiff[];
    randomization?: TextDiff[];
    variables?: TextDiff[];
    materials?: TextDiff[];
    dataCollection?: TextDiff[];
    sampleSelection?: TextDiff[];
}

export interface ExperimentDelta extends WorkDelta {
    objective?: TextDiff[];
    hypothesis?: TextDiff[];
    methodology?: MethodologyDelta;
    experimentPath?: string;
    pdfPath?: string;
}

export interface DatasetDelta extends WorkDelta {
    // ... dataset-specific fields
}

export interface DataAnalysisDelta extends WorkDelta {
    // ... data analysis-specific fields
}

export interface AIModelDelta extends WorkDelta {
    // ... AI model-specific fields
}

export interface CodeBlockDelta extends WorkDelta {
    // ... code block-specific fields
}

export interface PaperDelta extends WorkDelta {
    // ... paper-specific fields
}

export interface ProjectDeltaData {
    experiments?: { [key: string]: ExperimentDelta };
    datasets?: { [key: string]: DatasetDelta };
    dataAnalyses?: { [key: string]: DataAnalysisDelta };
    aiModels?: { [key: string]: AIModelDelta };
    codeBlocks?: { [key: string]: CodeBlockDelta };
    papers?: { [key: string]: PaperDelta };
}

export interface VersionsProjectDeltas {
    versionsProjectDeltas: ProjectDelta[];
}

export interface ProjectSnapshot {
    id: number;
    projectId: number;
    projectVersionId: number;
    createdAt?: string;
    snapshotData: ProjectLayout;
}

export type NodeData = { neighbors: string[]; isSnapshot?: boolean };

export type Graph = Record<string, NodeData>;

export interface ProjectGraph {
    id: number;
    projectId: string;
    createdAt?: string;
    graphData: Graph;
}

export interface WorkGraph {
    id: number;
    workId: number;
    workType: string;
    createdAt?: string;
    graphData: Graph;
}

// Create objects

export interface CreateProjectGraphInput {
    projectId: number;
    versionId: number;
}
