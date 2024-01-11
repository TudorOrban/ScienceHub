"use client";
import { useProjectDataContext } from "@/contexts/project/ProjectDataContext";
import WorksMultiBox, { MultiWorks } from "@/components/lists/WorksMultiBox";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";
import { transformWorkToWorkInfo } from "@/transforms-to-ui-types/transformWorkToWorkInfo";

const ResearchPage = () => {
    const { projectLayout } = useProjectDataContext();

    const projectMedium = {
        id: projectLayout?.id || -1,
        title: projectLayout?.title || "",
        name: projectLayout?.name || "",
    }
    // Getting data ready for display
    const multiWorks: MultiWorks = {
        experiments: projectLayout?.experiments?.map((experiment) => (
            transformWorkToWorkInfo(experiment, projectMedium))) || [],
        datasets: projectLayout?.datasets?.map((dataset) => (
            transformWorkToWorkInfo(dataset, projectMedium))) || [],
        dataAnalyses: projectLayout?.dataAnalyses?.map((dataAnalysis) => (
            transformWorkToWorkInfo(dataAnalysis, projectMedium))) || [],
        aiModels: projectLayout?.aiModels?.map((aiModel) => (
            transformWorkToWorkInfo(aiModel, projectMedium))) || [],
        codeBlocks: projectLayout?.codeBlocks?.map((codeBlock) => (
            transformWorkToWorkInfo(codeBlock, projectMedium))) || [],
        papers: projectLayout?.papers?.map((paper) => (
            transformWorkToWorkInfo(paper, projectMedium))) || [],
    }
    console.log("QWWQ", projectLayout);

    return (
        <div className="p-4">
            <WorksMultiBox works={multiWorks} />
        </div>
    );
};

export default ResearchPage;
