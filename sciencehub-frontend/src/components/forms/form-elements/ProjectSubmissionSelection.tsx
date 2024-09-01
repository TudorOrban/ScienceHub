import { faBoxArchive, faPaste, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";
import { Button } from "../../ui/button";
import SearchInput from "../../complex-elements/search-inputs/SearchInput";
import deepEqual from "fast-deep-equal";
import dynamic from "next/dynamic";
import { ProjectSubmissionSmall } from "@/src/types/versionControlTypes";
import { useProjectSubmissionSelectionContext } from "@/src/contexts/selections/ProjectSubmissionSelectionContext";
import { useProjectSubmissionsSearch } from "@/src/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import SmallProjectSubmissionCard from "@/src/components/cards/small-cards/SmallProjectSubmissionCard";
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

/**
 * Component for selecting a project submission for the Create Forms.
 * To be refactored.
 */
type ProjectSubmissionSelectionProps = {
    projectId: number;
    initialProjectSubmissionId?: number;
    restFieldProps: RestFieldProps;
    createNewOn?: boolean;
    inputClassName?: string;
};

const ProjectSubmissionSelection: React.FC<ProjectSubmissionSelectionProps> = ({
    projectId,
    initialProjectSubmissionId,
    restFieldProps,
    createNewOn,
    inputClassName,
}) => {
    // State for holding selected project's small info (id name title)
    const [selectedProjectSubmissionSmall, setSelectedProjectSubmissionSmall] =
        useState<ProjectSubmissionSmall>();

    // Project submission selection context
    const { selectedProjectSubmissionId, setSelectedProjectSubmissionId } =
        useProjectSubmissionSelectionContext();

    // Custom Projects hook
    // TODO: only fetch some projects
    const projectSubmissionsSmallData = useProjectSubmissionsSearch({
        extraFilters: { project_id: projectId },
        enabled: projectId !== 0,
        context: "Workspace General",
        page: 1,
        itemsPerPage: 100,
    });

    // Effects
    // - Initial project id
    useEffect(() => {
        if (initialProjectSubmissionId) {
            if (initialProjectSubmissionId !== selectedProjectSubmissionId) {
                setSelectedProjectSubmissionId(initialProjectSubmissionId);
            }

            const foundProjectSubmission = projectSubmissionsSmallData?.data.filter(
                (project) => project.id === initialProjectSubmissionId
            )[0];

            if (
                foundProjectSubmission &&
                !deepEqual(foundProjectSubmission, selectedProjectSubmissionSmall)
            ) {
                setSelectedProjectSubmissionSmall(foundProjectSubmission);
            }
        }
    }, [initialProjectSubmissionId, projectSubmissionsSmallData]);

    // - Create
    useEffect(() => {
        if (createNewOn && !initialProjectSubmissionId) {
            setSelectedProjectSubmissionId(0);
        }
    }, [createNewOn]);

    // Handlers: Add/remove Project
    const handleAddWorkProjectSubmission = (projectSubmissionId: number) => {
        setSelectedProjectSubmissionId(projectSubmissionId);
        setSelectedProjectSubmissionSmall(
            projectSubmissionsSmallData?.data.filter(
                (projectSubmission) => projectSubmission.id === projectSubmissionId
            )[0]
        );
    };

    const handleRemoveWorkProjectSubmission = (projectSubmissionId: number) => {
        setSelectedProjectSubmissionId(0);
        setSelectedProjectSubmissionSmall(undefined);
    };

    return (
        <div className="flex items-center h-10">
            <div className="flex items-center">
                <input
                    type="hidden"
                    value={JSON.stringify(selectedProjectSubmissionId)}
                    {...restFieldProps}
                />
                {selectedProjectSubmissionSmall && (
                    <SmallProjectSubmissionCard
                        projectSubmissionSmall={selectedProjectSubmissionSmall}
                        handleRemoveProjectSubmission={handleRemoveWorkProjectSubmission}
                    />
                )}
            </div>

            {selectedProjectSubmissionId === 0 && (
                <div className="">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="">
                                <SearchInput
                                    placeholder="Search project submissions..."
                                    context="Workspace General"
                                    inputClassName={`${inputClassName || ""}`}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="relative bg-white overflow-y-auto max-h-64">
                            <div className="grid">
                                {projectSubmissionsSmallData?.data.map(
                                    (projectSubmission, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                        >
                                            <Button
                                                onClick={() =>
                                                    handleAddWorkProjectSubmission(
                                                        projectSubmission.id
                                                    )
                                                }
                                                className="bg-gray-50 text-black m-0 w-60 hover:bg-gray-50 hover:text-black"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPaste}
                                                    className="small-icon px-2"
                                                />
                                                <div className="flex whitespace-nowrap">
                                                    {(projectSubmission?.title?.length || 0) > 20
                                                        ? `${projectSubmission?.title?.slice(
                                                              0,
                                                              20
                                                          )}...`
                                                        : projectSubmission?.title}
                                                </div>
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    );
};

export default ProjectSubmissionSelection;
