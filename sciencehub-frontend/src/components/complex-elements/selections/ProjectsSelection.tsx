import Popover from "@/src/components/light-simple-elements/Popover";
import { ProjectSmall } from "@/src/types/projectTypes";
import { faSearch, faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useReusableSearchContext } from "@/src/contexts/search-contexts/ReusableSearchContext";
import SmallProjectCard from "@/src/components/cards/small-cards/SmallProjectCard";
import { useProjectsSearch } from "@/src/hooks/fetch/search-hooks/projects/useProjectsSearch";

type ProjectsSelectionProps = {
    selectedProjects: ProjectSmall[];
    setSelectedProjects: (projects: ProjectSmall[]) => void;
    currentProject?: ProjectSmall;
    inputClassName?: string;
    width?: number;
};

/**
 * Component for selecting a project. Used in all AdvancedSearchOptions components.
 */
const ProjectsSelection: React.FC<ProjectsSelectionProps> = ({
    selectedProjects,
    setSelectedProjects,
    currentProject,
    inputClassName,
    width,
}) => {
    const defaultWidth = 256;

    // States
    const [localInputQuery, setLocalInputQuery] = useState<string>("");
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    // Contexts
    const { inputQuery, setInputQuery } = useReusableSearchContext();

    // Custom hooks
    // TODO: All projects, TBM later
    const projectsData = useProjectsSearch({
        extraFilters: {},
        enabled: true,
        context: "Reusable",
    });

    // Handlers
    // - Add project to selection (if not already selected)
    const handleAddSelectedProject = (newProject: ProjectSmall) => {
        if (!selectedProjects.some((project) => project.id === newProject.id)) {
            setSelectedProjects([...selectedProjects, newProject]);
        }
    };

    // - Remove project from selection (if not current project)
    const handleRemoveSelectedProject = (removeProjectId: number) => {
        const projects: ProjectSmall[] = selectedProjects.filter(
            (project) => project.id !== removeProjectId
        );
        if (!currentProject?.id || (currentProject?.id && removeProjectId !== currentProject.id)) {
            setSelectedProjects(projects);
        }
    };

    // Handle search query
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setLocalInputQuery(inputValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setInputQuery(localInputQuery);
        }
    };

    return (
        <div>
            <Popover
                button={{
                    label: "",
                    icon: undefined,
                }}
                buttonChildren={
                    <div className="flex items-center">
                        <input
                            placeholder={"Search projects..."}
                            value={localInputQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsPopoverOpen(true)}
                            className={`px-2 focus:outline-none ${inputClassName || ""}`}
                            style={{ minWidth: "80px", width: width || defaultWidth }}
                        />
                        <button
                            onClick={() => setInputQuery(localInputQuery)}
                            className="search-button"
                        >
                            <FontAwesomeIcon icon={faSearch} className="small-icon" />
                        </button>
                    </div>
                }
                isOpen={isPopoverOpen}
                setIsOpen={setIsPopoverOpen}
            >
                <div
                    className={`grid justify-center w-64 space-y-0.5 max-h-96 overflow-y-auto overflow-x-hidden p-0.5`}
                    style={{ width: width || defaultWidth }}
                >
                    {projectsData?.data
                        .filter(
                            (project) =>
                                !selectedProjects.some(
                                    (selectedProject) => selectedProject.id === project.id
                                )
                        )
                        .map((project, index) => (
                            <SmallProjectCard
                                projectSmall={{
                                    id: project.id,
                                    title: project.title || "",
                                    name: project.name || "",
                                }}
                                handleAddProject={handleAddSelectedProject}
                                key={project.id}
                            />
                        ))}
                </div>
            </Popover>
            {selectedProjects.length > 0 && (
                <div className="flex items-center flex-wrap pt-1">
                    {selectedProjects?.map((project, index) => (
                        <SmallProjectCard
                            projectSmall={project}
                            handleRemoveProject={handleRemoveSelectedProject}
                            className={inputClassName || ""}
                            key={project.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsSelection;
