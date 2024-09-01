"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useProjectIdByName } from "@/src/hooks/utils/useProjectIdByName";
import DirectoryUI from "@/src/components/cards/works/DirectoryCard";
import Breadcrumb from "@/src/components/elements/Breadcrumb";
import useProjectData from "@/src/hooks/fetch/data-hooks/projects/useProjectData";

// Project directory paged. Not currently used, more backend work required currently.
export default function ProjectDirectoryPage({
    params,
}: {
    params: { identifier: string; projectName: string };
}) {
    const { data: projectId, error: projectIdError } = useProjectIdByName({
        projectName: params.projectName,
    });
    const isProjectIdAvailable = projectId != null && !isNaN(Number(projectId));
    const pathname = usePathname();
    
    const projectData = useProjectData(
        projectId || 1,
        isProjectIdAvailable
    );

    if (!projectData) {
        return <div>No project Data</div>;
    }

    return (
        <div className="">
            <div className="m-4">
                <Breadcrumb />
                <h2 className="text-3xl font-bold mb-2 mt-4">
                    <div className="flex items-center ml-4 mb-4">Directory</div>
                </h2>
            </div>

            {projectData.data[0] && <DirectoryUI projectData={projectData.data[0]} />}
        </div>
    );
}
