"use client";

import UserProfileHeader from "@/components/headers/UserProfileHeader";
import WorksMultiBox, { MultiWorks } from "@/components/lists/WorksMultiBox";
import { useIdentifierContext } from "@/contexts/current-user/IdentifierContext";
import { useAllUserWorksSmall } from "@/hooks/utils/useAllUserWorksSmall";
import { transformWorkToWorkInfo } from "@/transforms-to-ui-types/transformWorkToWorkInfo";

export default function ResearchPage({
    params: { identifier },
}: {
    params: { identifier: string };
}) {
    const { identifier: contextIdentifier, users, teams, isUser } = useIdentifierContext();
    const currentUserId = users?.[0]?.id;
    const enabled = !!currentUserId && isUser;

    const userWorks = useAllUserWorksSmall({
        tableRowsIds: [currentUserId || ""],
        enabled: enabled,
    });

    // Getting data ready for display
    const multiWorks: MultiWorks = {
        experiments:
            userWorks.data?.[0]?.experiments?.map((experiment) =>
                transformWorkToWorkInfo(experiment, undefined)
            ) || [],
        datasets:
            userWorks.data?.[0]?.datasets?.map((dataset) =>
                transformWorkToWorkInfo(dataset, undefined)
            ) || [],
        dataAnalyses:
            userWorks.data?.[0]?.dataAnalyses?.map((dataAnalysis) =>
                transformWorkToWorkInfo(dataAnalysis, undefined)
            ) || [],
        aiModels:
            userWorks.data?.[0]?.aiModels?.map((aiModel) =>
                transformWorkToWorkInfo(aiModel, undefined)
            ) || [],
        codeBlocks:
            userWorks.data?.[0]?.codeBlocks?.map((codeBlock) =>
                transformWorkToWorkInfo(codeBlock, undefined)
            ) || [],
        papers:
            userWorks.data?.[0]?.papers?.map((paper) =>
                transformWorkToWorkInfo(paper, undefined)
            ) || [],
    };

    return (
        <div>
            <UserProfileHeader startingActiveTab="Research" />
            <div className="p-4">
                <WorksMultiBox
                    works={multiWorks}
                    link={`${identifier}/research`}
                    addToLink={true}
                />
            </div>
        </div>
    );
}
