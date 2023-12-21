"use client";

import { ProjectSubmission } from "@/types/versionControlTypes";
import { ProjectLayout } from "@/types/projectTypes";
import React, { useState } from "react";
import ProjectSubmissionHeader from "@/components/headers/ProjectSubmissionHeader";
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
            <ProjectSubmissionHeader submission={submission} project={project} isLoading={isLoading} refetchSubmission={refetchSubmission} revalidatePath={revalidatePath} identifier={identifier} />
            <ProjectSubmissionChangesCard submission={submission} project={project} isLoading={isLoading} />
        </div>
    );
};

export default ProjectSubmissionCard;
