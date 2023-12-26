import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";
import { Button } from "../../ui/button";
import SearchInput from "../../complex-elements/search-inputs/SearchInput";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import deepEqual from "fast-deep-equal";
import dynamic from "next/dynamic";
import { ProjectSubmissionSmall } from "@/types/versionControlTypes";
import { useProjectSubmissionSelectionContext } from "@/contexts/selections/ProjectSubmissionSelectionContext";
import { useProjectSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useProjectSubmissionsSearch";
import SmallProjectSubmissionCard from "@/components/elements/SmallProjectSubmissionCard";
const Popover = dynamic(() => import("@/components/ui/popover").then((mod) => mod.Popover));
const PopoverContent = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.PopoverContent)
);
const PopoverTrigger = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.PopoverTrigger)
);
const SmallProjectCard = dynamic(() => import("@/components/elements/SmallProjectCard"));

type RestFieldProps = {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    name: string;
    ref: RefCallBack;
};

type ProjectSubmissionSelectionProps = {
    projectId: string;
    initialProjectSubmissionId?: string;
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
    const [selectedProjectSubmissionSmall, setSelectedProjectSubmissionSmall] = useState<ProjectSubmissionSmall>();

    // Contexts
    // - Project submission selection context
    const { selectedProjectSubmissionId, setSelectedProjectSubmissionId } = useProjectSubmissionSelectionContext();

    // Custom Projects hook
    // TODO: only fetch some projects
    const projectSubmissionsSmallData = useProjectSubmissionsSearch({
        extraFilters: { project_id: projectId },
        enabled: !!projectId,
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
                (project) => project.id === Number(initialProjectSubmissionId)
            )[0];

            if (foundProjectSubmission && !deepEqual(foundProjectSubmission, selectedProjectSubmissionSmall)) {
                setSelectedProjectSubmissionSmall(foundProjectSubmission);
            }
        }
    }, [initialProjectSubmissionId, projectSubmissionsSmallData]);

    // - Create
    useEffect(() => {
        if (createNewOn && !initialProjectSubmissionId) {
            setSelectedProjectSubmissionId("");
        }
    }, [createNewOn]);

    // Handlers
    // - Add Work's Project
    const handleAddWorkProjectSubmission = (projectSubmissionId: string) => {
        setSelectedProjectSubmissionId(projectSubmissionId);
        setSelectedProjectSubmissionSmall(
            projectSubmissionsSmallData?.data.filter((projectSubmission) => projectSubmission.id === Number(projectSubmissionId))[0]
        );
    };

    // - Remove Work's Project
    const handleRemoveWorkProjectSubmission = (projectSubmissionId: string) => {
        setSelectedProjectSubmissionId("");
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

            {selectedProjectSubmissionId === "" && (
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
                                {projectSubmissionsSmallData?.data.map((projectSubmission, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                    >
                                        <Button
                                            onClick={() =>
                                                handleAddWorkProjectSubmission(projectSubmission.id.toString())
                                            }
                                            className="bg-gray-50 text-black m-0 w-60 hover:bg-gray-50 hover:text-black"
                                        >
                                            <FontAwesomeIcon
                                                icon={faBoxArchive}
                                                className="small-icon px-2"
                                            />
                                            <div className="flex whitespace-nowrap">
                                                {(projectSubmission?.title?.length || 0) > 20
                                                    ? `${projectSubmission?.title?.slice(0, 20)}...`
                                                    : projectSubmission?.title}
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

export default ProjectSubmissionSelection;
