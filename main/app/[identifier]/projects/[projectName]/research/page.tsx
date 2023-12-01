"use client";
import { useProjectDataContext } from "@/app/contexts/project/ProjectDataContext";
import WorksMultiBox, { MultiWorks } from "@/components/lists/WorksMultiBox";
import { transformToWorksInfo } from "@/transforms-to-ui-types/transformToWorksInfo";

const ResearchPage = () => {
    const { projectLayout, setProjectLayout, isLoading, setIsLoading } =
        useProjectDataContext();

    // Getting data ready for display
    const multiWorks: MultiWorks = {
        experiments: transformToWorksInfo(
            projectLayout?.experiments || [],
            [],
            "experiments",
            "Project General"
        ),
        datasets: transformToWorksInfo(
            projectLayout?.datasets || [],
            [],
            "datasets",
            "Project General"
        ),
        dataAnalyses: transformToWorksInfo(
            projectLayout?.dataAnalyses || [],
            [],
            "data analyses",
            "Project General"
        ),
        aiModels: transformToWorksInfo(
            projectLayout?.aiModels || [],
            [],
            "ai_models",
            "Project General"
        ),
        codeBlocks: transformToWorksInfo(
            projectLayout?.codeBlocks || [],
            [],
            "code_blocks",
            "Project General"
        ),
        papers: transformToWorksInfo(
            projectLayout?.papers || [],
            [],
            "papers",
            "Project General"
        ),
    };

    return (
        <div className="p-4">
            {multiWorks.experiments.length ||
            multiWorks.datasets.length ||
            multiWorks.dataAnalyses.length ||
            multiWorks.aiModels.length ||
            multiWorks.codeBlocks.length ||
            multiWorks.papers.length ? (
                <div className="pt-4">
                    <WorksMultiBox works={multiWorks} />
                </div>
            ) : null}
        </div>
    );
};

export default ResearchPage;
