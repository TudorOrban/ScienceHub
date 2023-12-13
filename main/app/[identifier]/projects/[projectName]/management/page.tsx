"use client";
import { useProjectDataContext } from "@/app/contexts/project/ProjectDataContext";
import GeneralBox from "@/components/lists/GeneralBox";
import { transformToIssuesInfo } from "@/transforms-to-ui-types/transformToIssuesInfo";
import { transformToReviewsInfo } from "@/transforms-to-ui-types/transformToReviewsInfo";
import { transformToSubmissionsInfo } from "@/transforms-to-ui-types/transformToSubmissionsInfo";

import useProjectGraph from "@/app/version-control-system/hooks/useProjectGraph";
import ProjectVersionGraph from "@/components/visualizations/ProjectVersionGraph";

export default function ManagementPage({
    params,
}: {
    params: { identifier: string; projectName: string };
}) {
    const { projectLayout, setProjectLayout, isLoading, setIsLoading } =
        useProjectDataContext();

    // Preliminaries
    const { identifier, projectName } = params;

    const projectGraphData = useProjectGraph(
        projectLayout.id || 0,
        !!projectLayout.id
    );

    const projectSubmissions = transformToSubmissionsInfo(
        projectLayout?.projectSubmissions || [],
        [],
        [],
        [],
        [],
        false,
        "project_submissions"
    );

    const projectIssues = transformToIssuesInfo(
        projectLayout?.projectIssues || [],
        [],
        [],
        [],
        [],
        false
    );

    const projectReviews = transformToReviewsInfo(
        projectLayout?.projectReviews || [],
        [],
        [],
        [],
        [],
        false
    );

    return (
        <div className="p-4">
            <div className="flex items-center space-x-4 pt-4">
                <GeneralBox
                    title={"Submissions"}
                    currentItems={projectSubmissions}
                    createdAtOn={true}
                />
                <GeneralBox
                    title={"Issues"}
                    currentItems={projectIssues}
                    createdAtOn={true}
                />
                <GeneralBox
                    title={"Reviews"}
                    currentItems={projectReviews}
                    createdAtOn={true}
                />
            </div>
            <div>
                Management!
                <ProjectVersionGraph
                    projectGraph={
                        projectGraphData.data[0] || {
                            id: 0,
                            projectId: "",
                            graphData: {},
                        }
                    }
                    selectedVersionId={"1"}
                    handleSelectGraphNode={() => {}}
                    expanded={true}
                />
            </div>
        </div>
    );
}
