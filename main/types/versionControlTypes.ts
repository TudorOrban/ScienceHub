// Version control

import { Team } from "./communityTypes";
import { ProjectLayout } from "./projectTypes";
import { User } from "./userTypes";
import { FileLocation } from "./workTypes";

export interface ProjectSubmissionSmall {
    id: number;
    projectId: number;
    initialProjectVersionId?: number;
    finalProjectVersionId?: number;
    createdAt?: string;
    updatedAt?: string;
    users?: User[];
    title?: string;
    status?: SubmissionStatus;
    public?: boolean;
    workSubmissions?: WorkSubmissionSmall[];
}

export interface ProjectSubmission {
    id: number;
    projectId: number;
    initialProjectVersionId?: number;
    finalProjectVersionId?: number;
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
    workSubmissions?: WorkSubmission[];
    projectDelta?: ProjectDelta;
}

export interface WorkSubmissionSmall {
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
    versionTag?: string;
    createdAt?: string;
}

export interface WorkVersion {
    id: number;
    workType: string;
    workId: number;
    versionNumber?: number;
    versionTag?: string;
    createdAt?: string;
}

// Deltas
export interface TextDiff {
    position: number;
    deleteCount: number;
    insert: string;
}

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

export interface WorkDeltaSmall {
    title?: DiffInfo;
    description?: DiffInfo;
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
export interface ProjectDelta {
    title?: DiffInfo;
    description?: DiffInfo;
    abstract?: DiffInfo;
    doi?: DiffInfo;
    license?: DiffInfo;
    publisher?: DiffInfo;
    conference?: DiffInfo;
    researchGrants?: DiffInfo;
    tags?: DiffInfo;
    keywords?: DiffInfo;
}

export type ProjectDeltaKey = keyof ProjectDelta;

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
