import MediumProjectCardUI from "@/src/components/cards/projects/MediumProjectCardUI";
import { MediumProjectCard } from "@/src/types/projectTypes";

type SearchResultsProps = {
    data?: any[];
    isLoading: boolean;
    isError: boolean;
    viewMode: "expanded" | "collapsed";
    disableViewMode?: boolean;
};

/**
 * Component for project lists.
 */
const ProjectSearchResults: React.FC<SearchResultsProps> = ({
    data,
    isLoading,
    isError,
    viewMode,
    disableViewMode,
}) => {
    const loadingProjects: MediumProjectCard[] = [
        { id: -1, title: "" },
        { id: -2, title: "" },
        { id: -3, title: "" },
        { id: -4, title: "" },
    ];

    // TODO: Better error handling
    if (isError) {
        return <p>An error occurred.</p>;
    }

    if (isLoading) {
        return (
            <>
                {(loadingProjects || []).map((project, index) => (
                    <div
                        key={project.id}
                        className={`mx-6 ${viewMode === "expanded" ? "my-6" : "my-4"}`}
                    >
                        <MediumProjectCardUI
                            project={project}
                            viewMode={viewMode}
                            disableViewMode={false}
                            isLoading={isLoading}
                        />
                    </div>
                ))}
            </>
        );
    }

    return (
        <div className="">
            {(data || []).map((project, index) => (
                <div
                    key={project.id}
                    className={`mx-6 ${viewMode === "expanded" ? "my-6" : "my-4"}`}
                >
                    <MediumProjectCardUI
                        project={project}
                        viewMode={viewMode}
                        disableViewMode={disableViewMode}
                        isLoading={isLoading}
                    />
                </div>
            ))}
        </div>
    );
};

export default ProjectSearchResults;
