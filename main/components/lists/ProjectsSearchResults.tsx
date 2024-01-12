import MediumProjectCardUI from "@/components/cards/projects/MediumProjectCardUI";
import { MediumProjectCard } from "@/types/projectTypes";

type SearchResultsProps = {
    data?: any[];
    isLoading: boolean;
    isError: boolean;
    viewMode: "expanded" | "collapsed";
    disableViewMode?: boolean;
    onDeleteProject: (projectId: number) => void;
};

const ProjectSearchResults: React.FC<SearchResultsProps> = ({
    data,
    isLoading,
    isError,
    viewMode,
    disableViewMode,
    onDeleteProject,
}) => {
    const loadingProjects: MediumProjectCard[] = [
        { id: -1, title: "" },
        { id: -2, title: "" },
        { id: -3, title: "" },
        { id: -4, title: "" },
    ];

    if (isError) {
        return <p>An error occurred.</p>;
    }

    return (
        <div className="">
            {!isLoading ? (
                <>
                    {(data || []).map((project, index) => (
                        <div key={project.id} className={`mx-6 ${viewMode === "expanded" ? "my-6" : "my-4"}`}>
                            <MediumProjectCardUI
                                project={project}
                                viewMode={viewMode}
                                disableViewMode={disableViewMode}
                                isLoading={isLoading}
                                onDeleteProject={onDeleteProject}
                            />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    {(loadingProjects || []).map((project, index) => (
                        <div key={project.id} className={`mx-6 ${viewMode === "expanded" ? "my-6" : "my-4"}`}>
                            <MediumProjectCardUI
                                project={project}
                                viewMode={viewMode}
                                onDeleteProject={onDeleteProject}
                                disableViewMode={false}
                                isLoading={isLoading}
                                isError={isError}
                            />
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default ProjectSearchResults;