"use client";

import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
import WorkspaceOverviewHeader from "@/components/headers/WorkspaceOverviewHeader";
import WorksMultiBox, { MultiWorks } from "@/components/lists/WorksMultiBox";
import { useCurrentUserDataContext } from "@/contexts/current-user/CurrentUserDataContext";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";
import useUserData from "@/hooks/utils/useUserData";
import { transformWorkToWorkInfo } from "@/transforms-to-ui-types/transformWorkToWorkInfo";

export default function ResearchPage() {
    // Contexts
    const { userSmall } = useUserSmallDataContext();
    const currentUserId = userSmall.data?.[0]?.id;

    // Custom hook
    const userData = useUserData(currentUserId || "", !!currentUserId);

    // Getting data ready for display
    const multiWorks: MultiWorks = {
        experiments:
            userData.data?.[0]?.experiments?.map((experiment) =>
                transformWorkToWorkInfo(experiment, undefined)
            ) || [],
        datasets:
            userData.data?.[0]?.datasets?.map((dataset) =>
                transformWorkToWorkInfo(dataset, undefined)
            ) || [],
        dataAnalyses:
            userData.data?.[0]?.dataAnalyses?.map((dataAnalysis) =>
                transformWorkToWorkInfo(dataAnalysis, undefined)
            ) || [],
        aiModels:
            userData.data?.[0]?.aiModels?.map((aiModel) =>
                transformWorkToWorkInfo(aiModel, undefined)
            ) || [],
        codeBlocks:
            userData.data?.[0]?.codeBlocks?.map((codeBlock) =>
                transformWorkToWorkInfo(codeBlock, undefined)
            ) || [],
        papers:
            userData.data?.[0]?.papers?.map((paper) => transformWorkToWorkInfo(paper, undefined)) ||
            [],
    };

    if (!currentUserId) {
        return <WorkspaceNoUserFallback />;
    }

    return (
        <>
            <WorkspaceOverviewHeader
                startingActiveTab="Research"
                currentUser={userSmall.data?.[0]}
            />
            <div className="p-4">
                <WorksMultiBox works={multiWorks} />
            </div>
        </>
    );
}
