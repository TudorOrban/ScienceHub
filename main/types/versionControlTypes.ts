// Version control

import { Team } from "./communityTypes";
import { ProjectLayout, ProjectMetadata } from "./projectTypes";
import { User } from "./userTypes";
import { FileLocation } from "./workTypes";

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
    workDelta: WorkDelta;
    fileChanges?: FileChanges;
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
    versionNumber?: number;
    createdAt?: string;
}

export interface WorkVersion {
    id: number;
    workType: string;
    workId: number;
    versionNumber?: number;
    createdAt?: string;
}

// export interface WorkVersions {
//     workVersions: WorkVersion[],
//     extraInfo?: string;
// }


// Works delta
export interface TextDiff {
    position: number;
    deleteCount: number;
    insert: string;
}

export type Diff = TextDiff[] | string[];

export interface DiffInfo {
    type: "TextDiff" | "TextArray";
    textDiffs?: TextDiff[];
    textArrays?: string[];
    lastChangeDate?: string;
    lastChangeUser?: User;
}

export interface FileChanges {
    fileToBeRemoved?: FileLocation;
    fileToBeAdded?: FileLocation;
    fileToBeUpdated?: FileLocation;
}

export interface WorkDelta {
    title?: DiffInfo;
    description?: DiffInfo;
    // notes?: DiffInfo;
    objective?: DiffInfo;
    abstract?: DiffInfo;
    doi?: DiffInfo;
    license?: DiffInfo;
    publisher?: DiffInfo;
    conference?: DiffInfo;
    researchGrants?: DiffInfo;
    tags?: DiffInfo;
    keywords?: DiffInfo;
}

export type WorkDeltaKey = keyof WorkDelta;

// Project delta
export interface ProjectDeltaData {
    projectMetadata?: ProjectMetadata;
    experiments?: WorkDelta[];
    datasets?: WorkDelta[];
    dataAnalyses?: WorkDelta[];
    aiModels?: WorkDelta[];
    codeBlocks?: WorkDelta[];
    papers?: WorkDelta[];
}

export interface ProjectDelta {
    id: number;
    initialProjectVersionId?: number;
    finalProjectVersionId?: number;
    deltaData: ProjectDeltaData;
}


// Version graph and snapshot
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
