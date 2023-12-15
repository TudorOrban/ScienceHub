import { useProjectsSmallSearch } from "@/hooks/fetch/search-hooks/projects/useProjectsSmallSearch";
import { ProjectSmall } from "@/types/projectTypes";
import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import SearchInput from "../complex-elements/SearchInput";
import { useBrowseSearchContext } from "@/hooks/fetch/search-hooks/useBrowseSearchContext";
const Popover = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.Popover)
);
const PopoverContent = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.PopoverContent)
);
const PopoverTrigger = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.PopoverTrigger)
);

type ProjectsFilterSelectionProps = {
    context: string;
    inputClassName?: string;
};

const ProjectSelection: React.FC<ProjectsFilterSelectionProps> = ({
    context,
    inputClassName,
}) => {
    // Contexts
    // - Selected users small
    const browseContext = useBrowseSearchContext(context);
    if (!browseContext) {
        throw new Error(
            "BrowseWorksSearchContext must be used within a BrowseWorksSearchProvider"
        );
    }
    if (
        !(
            "projects" in browseContext.userSetStates &&
            "setProjects" in browseContext.userSetStates
        )
    ) {
        throw new Error("Invalid context: projects field is missing");
    }
    const {
        userSetStates: { projects, setProjects },
        filters,
    } = browseContext as typeof browseContext & {
        userSetStates: {
            projects: ProjectSmall[];
            setProjects: React.Dispatch<React.SetStateAction<ProjectSmall[]>>;
        };
    };


    // Custom projects hook
    // TODO: only fetch some projects
    const projectsSmallData = useProjectsSmallSearch({
        extraFilters: {},
        enabled: true,
        context: "Workspace General",
        page: 1,
        itemsPerPage: 100,
    });

    // Handlers
    // - Handle adding Work's Project Filter
    const handleAddWorkProject = (projectId: string) => {
        const newProject = projectsSmallData?.data.filter(
            (project) => project.id.toString() === projectId
        )[0];
        setProjects([...projects, newProject]);
    };

    // - Handle removing Work's Project Filter
    const handleRemoveWorkProject = (projectId: string) => {
        const newProjects = projects.filter(
            (project) => project.id.toString() !== projectId
        );
        setProjects(newProjects);
    };

    return (
        <div className="flex-none ">
            <div className="w-[176px] ">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="pt-1">
                            <SearchInput
                                placeholder="Search projects..."
                                context="Workspace General"
                                inputClassName={`${
                                    inputClassName || ""
                                } w-[176px]`}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="relative bg-white overflow-y-auto overflow-x-hidden max-h-64 left-5 w-[218px] z-40">
                        <div className="grid">
                            {projectsSmallData?.data
                                .filter(
                                    (project) =>
                                        !projects
                                            .map((pr) => pr.id)
                                            .includes(project.id)
                                )
                                .map((project, index) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                    >
                                        <Button
                                            onClick={() =>
                                                handleAddWorkProject(
                                                    project.id.toString()
                                                )
                                            }
                                            className="bg-gray-50 text-black m-0 w-40 px-2 hover:bg-gray-50 hover:text-black"
                                        >
                                            <FontAwesomeIcon
                                                icon={faBoxArchive}
                                                className="small-icon px-2"
                                            />
                                            <div className="flex whitespace-nowrap">
                                                {project.title.length > 13
                                                    ? `${project.title.slice(
                                                          0,
                                                          18
                                                      )}...`
                                                    : project.title}
                                            </div>
                                        </Button>
                                    </div>
                                ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            {projects && (
                <div className="pt-1">
                    {projects?.map((project, index) => (
                        <div
                            key={project.id}
                            className="flex items-center pr-2 bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                        >
                            <FontAwesomeIcon
                                icon={faBoxArchive}
                                className="small-icon px-2"
                            />
                            <div className="flex-grow whitespace-nowrap font-semibold text-sm">
                                {project.title.length > 15
                                    ? `${project.title.slice(0, 20)}...`
                                    : project.title}
                            </div>
                            <Button
                                onClick={() =>
                                    handleRemoveWorkProject(
                                        project.id.toString()
                                    )
                                }
                                className="bg-gray-50 text-black m-0 pl-2 pr-1 py-1 hover:bg-gray-50"
                            >
                                <FontAwesomeIcon
                                    icon={faXmark}
                                    className="small-icon text-gray-500 hover:text-red-700"
                                />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectSelection;
