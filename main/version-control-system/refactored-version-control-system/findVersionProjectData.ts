import { flattenWorks } from "@/hooks/utils/flattenWorks";
import { fetchGeneralData } from "@/services/fetch/fetchGeneralData";
import { fetchProjectData } from "@/services/fetch/fetchProjectDataTest";
import { ProjectMetadata } from "@/types/projectTypes";
import { Graph, ProjectGraph, WorkSubmission } from "@/types/versionControlTypes";
import { Work, WorkSmall } from "@/types/workTypes";
import supabase from "@/utils/supabase";
import { findClosestSnapshot } from "../project-reconstruction/findClosestSnapshot";

export const findVersionProjectData = async (
    projectId: string,
    projectVersionId: string
) => {
    const projectGraphData = await fetchGeneralData<ProjectGraph>(supabase, {
        tableName: "project_versions_graphs",
        categories: [],
        options: { filters: { project_id: [projectId] }}
    });

    console.log("GRAPH", projectGraphData.data[0].graphData);

    const { closestSnapshotVersionId, path } = findClosestSnapshot(
        projectGraphData.data[0],
        projectVersionId
    );
        
    console.log("PATH", closestSnapshotVersionId, path);
    
    
};

type WorkGraph = {
    id: number;
    workId: string;
    createdAt?: Date;
    graphData?: Graph;
};


type ProjectConfiguration = {};

type WorkMetadata = {
    license?: string;
};

type WorkDeltaData = {
    workMetadata?: WorkMetadata;
};

type WorkDelta = {
    id: number;
    workType: string;
    versionIdFrom: number;
    versionIdTo: number;
    deltaData: WorkDeltaData;
};

export interface WorkSnapshot {
    id: number;
    workId: number;
    workType: string;
    workVersionId: number;
    createdAt?: string;
    snapshotData: Work;
}


type ProjectDeltaData = {
    projectMetadata: ProjectMetadata;
    projectConfiguration: ProjectConfiguration;
    workSubmissions: WorkDelta[];
};
