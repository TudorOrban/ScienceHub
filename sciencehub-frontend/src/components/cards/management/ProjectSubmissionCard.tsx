"use client";

import { ProjectSubmission } from "@/src/types/versionControlTypes";
import { ProjectLayout } from "@/src/types/projectTypes";
import React from "react";
import ProjectSubmissionHeader from "@/src/components/headers/ProjectSubmissionHeader";
import ProjectSubmissionChangesCard from "./ProjectSubmissionChangesCard";

interface ProjectSubmissionCardProps {
    submission: ProjectSubmission;
    project: ProjectLayout;
    isLoading?: boolean;
    projectIsLoading?: boolean;
    refetchSubmission?: () => void;
    refetchProject?: () => void;
    revalidatePath?: (pathname: string) => void;
    identifier?: string;
}

/**
 * Component for displaying a full project submission. Used in dynamic route.
 */
const ProjectSubmissionCard: React.FC<ProjectSubmissionCardProps> = ({
    submission,
    project,
    isLoading,
    projectIsLoading,
    refetchSubmission,
    refetchProject,
    revalidatePath,
    identifier,
}) => {
    return (
        <div>
            <ProjectSubmissionHeader
                submission={submission}
                project={project}
                isLoading={isLoading}
                refetchSubmission={refetchSubmission}
                revalidatePath={revalidatePath}
                identifier={identifier}
            />
            <ProjectSubmissionChangesCard
                submission={submission}
                project={project}
                isLoading={isLoading}
            />
        </div>
    );
};

export default ProjectSubmissionCard;
