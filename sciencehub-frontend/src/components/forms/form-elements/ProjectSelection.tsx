import { useProjectSelectionContext } from "@/src/contexts/selections/ProjectSelectionContext";
import { useProjectsSmallSearch } from "@/src/hooks/fetch/search-hooks/projects/useProjectsSmallSearch";
import { ProjectSmall } from "@/src/types/projectTypes";
import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";
import { Button } from "../../ui/button";
import SearchInput from "../../complex-elements/search-inputs/SearchInput";
import { useUserId } from "@/src/contexts/current-user/UserIdContext";
import deepEqual from "fast-deep-equal";

import dynamic from "next/dynamic";
import SmallProjectCard from "@/src/components/cards/small-cards/SmallProjectCard";
const Popover = dynamic(() => import("@/src/components/ui/popover").then((mod) => mod.Popover));
const PopoverContent = dynamic(() =>
    import("@/src/components/ui/popover").then((mod) => mod.PopoverContent)
);
const PopoverTrigger = dynamic(() =>
    import("@/src/components/ui/popover").then((mod) => mod.PopoverTrigger)
);

type RestFieldProps = {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    name: string;
    ref: RefCallBack;
};

type ProjectSelectionProps = {
    initialProjectId?: number;
    restFieldProps: RestFieldProps;
    createNewOn?: boolean;
    inputClassName?: string;
};

/**
 * Component for selecting a project for the Create Forms.
 * To be refactored.
 */
const ProjectSelection: React.FC<ProjectSelectionProps> = ({
    initialProjectId,
    restFieldProps,
    createNewOn,
    inputClassName,
}) => {
    // State for holding selected project's small info (id name title)
    const [selectedProjectSmall, setSelectedProjectSmall] = useState<ProjectSmall>();

    // Contexts
    const currentUserId = useUserId();
    // - Project selection context
    const { selectedProjectId, setSelectedProjectId } = useProjectSelectionContext();

    // Custom Projects hook
    // TODO: only fetch some projects
    const projectsSmallData = useProjectsSmallSearch({
        extraFilters: { users: currentUserId },
        enabled: !!currentUserId,
        context: "Workspace General",
        page: 1,
        itemsPerPage: 100,
    });

    // Effects
    // - Initial project id
    useEffect(() => {
        if (initialProjectId) {
            if (initialProjectId !== selectedProjectId) {
                setSelectedProjectId(initialProjectId);
            }

            const foundProject = projectsSmallData?.data.filter(
                (project) => project.id === initialProjectId
            )[0];

            if (foundProject && !deepEqual(foundProject, selectedProjectSmall)) {
                setSelectedProjectSmall(foundProject);
            }
        }
    }, [initialProjectId, projectsSmallData]);

    // - Create
    useEffect(() => {
        if (createNewOn && !initialProjectId) {
            setSelectedProjectId(0);
        }
    }, [createNewOn]);

    // Handlers: Add/Remove Project
    const handleAddWorkProject = (projectId: number) => {
        setSelectedProjectId(projectId);
        setSelectedProjectSmall(
            projectsSmallData?.data.filter((project) => project.id === projectId)[0]
        );
    };

    const handleRemoveWorkProject = (projectId: number) => {
        setSelectedProjectId(0);
        setSelectedProjectSmall(undefined);
    };

    return (
        <div className="flex items-center h-10">
            <div className="flex items-center">
                <input
                    type="hidden"
                    value={JSON.stringify(selectedProjectId)}
                    {...restFieldProps}
                />
                {selectedProjectSmall && (
                    <SmallProjectCard
                        projectSmall={selectedProjectSmall}
                        handleRemoveProject={handleRemoveWorkProject}
                    />
                )}
            </div>

            {selectedProjectId === 0 && (
                <div className="">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="">
                                <SearchInput
                                    placeholder="Search projects..."
                                    context="Workspace General"
                                    inputClassName={`${inputClassName || ""}`}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="relative bg-white overflow-y-auto max-h-64">
                            <div className="grid">
                                {projectsSmallData?.data.map((project, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                    >
                                        <Button
                                            onClick={() => handleAddWorkProject(project.id)}
                                            className="bg-gray-50 text-black m-0 w-60 hover:bg-gray-50 hover:text-black"
                                        >
                                            <FontAwesomeIcon
                                                icon={faBoxArchive}
                                                className="small-icon px-2"
                                            />
                                            <div className="flex whitespace-nowrap">
                                                {project.title.length > 20
                                                    ? `${project.title.slice(0, 20)}...`
                                                    : project.title}
                                            </div>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    );
};

export default ProjectSelection;
