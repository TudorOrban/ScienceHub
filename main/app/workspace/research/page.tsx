"use client";

import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
import WorksMultiBox, { MultiWorks } from "@/components/lists/WorksMultiBox";
import { useCurrentUserDataContext } from "@/contexts/current-user/CurrentUserDataContext";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { transformWorkToWorkInfo } from "@/transforms-to-ui-types/transformWorkToWorkInfo";

export default function ResearchPage() {
    const { currentUserData, setCurrentUserData } = useCurrentUserDataContext();

    const currentUserId = useUserId();
    
    // Getting data ready for display
    const multiWorks: MultiWorks = {
        experiments: currentUserData?.experiments?.map((experiment) => (
            transformWorkToWorkInfo(experiment, undefined))) || [],
        datasets: currentUserData?.datasets?.map((dataset) => (
            transformWorkToWorkInfo(dataset, undefined))) || [],
        dataAnalyses: currentUserData?.dataAnalyses?.map((dataAnalysis) => (
            transformWorkToWorkInfo(dataAnalysis, undefined))) || [],
        aiModels: currentUserData?.aiModels?.map((aiModel) => (
            transformWorkToWorkInfo(aiModel, undefined))) || [],
        codeBlocks: currentUserData?.codeBlocks?.map((codeBlock) => (
            transformWorkToWorkInfo(codeBlock, undefined))) || [],
        papers: currentUserData?.papers?.map((paper) => (
            transformWorkToWorkInfo(paper, undefined))) || [],
    }

    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }

    return (
        <div className="p-4">
            <WorksMultiBox works={multiWorks} />
        </div>
    )
}
