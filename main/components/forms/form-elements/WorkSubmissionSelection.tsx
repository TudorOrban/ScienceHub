import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";
import { Button } from "../../ui/button";
import SearchInput from "../../complex-elements/search-inputs/SearchInput";
import deepEqual from "fast-deep-equal";
import dynamic from "next/dynamic";
import { WorkSubmissionSmall } from "@/types/versionControlTypes";
import { useWorkSubmissionSelectionContext } from "@/contexts/selections/WorkSubmissionSelectionContext";
import { useWorkSubmissionsSearch } from "@/hooks/fetch/search-hooks/submissions/useWorkSubmissionsSearch";
import SmallWorkSubmissionCard from "@/components/cards/small-cards/SmallWorkSubmissionCard";
const Popover = dynamic(() => import("@/components/ui/popover").then((mod) => mod.Popover));
const PopoverContent = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.PopoverContent)
);
const PopoverTrigger = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.PopoverTrigger)
);

type RestFieldProps = {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    name: string;
    ref: RefCallBack;
};

type WorkSubmissionSelectionProps = {
    workId: number;
    initialWorkSubmissionId?: number;
    restFieldProps: RestFieldProps;
    createNewOn?: boolean;
    inputClassName?: string;
};

/**
 * Component for selecting work submission for the Create Forms.
 * To be refactored.
 */
const WorkSubmissionSelection: React.FC<WorkSubmissionSelectionProps> = ({
    workId,
    initialWorkSubmissionId,
    restFieldProps,
    createNewOn,
    inputClassName,
}) => {
    // State for holding selected work's small info (id name title)
    const [selectedWorkSubmissionSmall, setSelectedWorkSubmissionSmall] =
        useState<WorkSubmissionSmall>();

    // Work submission selection context
    const { selectedWorkSubmissionId, setSelectedWorkSubmissionId } =
        useWorkSubmissionSelectionContext();

    // Custom Work submissions hook
    // TODO: only fetch some work submissions
    const workSubmissionsSmallData = useWorkSubmissionsSearch({
        extraFilters: { work_id: workId },
        enabled: workId !== 0,
        context: "Workspace General",
        page: 1,
        itemsPerPage: 100,
    });

    // Effects
    // - Initial work id
    useEffect(() => {
        if (initialWorkSubmissionId) {
            if (initialWorkSubmissionId !== selectedWorkSubmissionId) {
                setSelectedWorkSubmissionId(initialWorkSubmissionId);
            }

            const foundWorkSubmission = workSubmissionsSmallData?.data.filter(
                (work) => work.id === initialWorkSubmissionId
            )[0];

            if (
                foundWorkSubmission &&
                !deepEqual(foundWorkSubmission, selectedWorkSubmissionSmall)
            ) {
                setSelectedWorkSubmissionSmall(foundWorkSubmission);
            }
        }
    }, [initialWorkSubmissionId, workSubmissionsSmallData]);

    // - Create
    useEffect(() => {
        if (createNewOn && !initialWorkSubmissionId) {
            setSelectedWorkSubmissionId(0);
        }
    }, [createNewOn]);

    // Handlers
    // - Add Work's Work
    const handleAddWorkWorkSubmission = (workSubmissionId: number) => {
        setSelectedWorkSubmissionId(workSubmissionId);
        setSelectedWorkSubmissionSmall(
            workSubmissionsSmallData?.data.filter(
                (workSubmission) => workSubmission.id === workSubmissionId
            )[0]
        );
    };

    // - Remove Work's Work
    const handleRemoveWorkWorkSubmission = (workSubmissionId: number) => {
        setSelectedWorkSubmissionId(0);
        setSelectedWorkSubmissionSmall(undefined);
    };

    return (
        <div className="flex items-center h-10">
            <div className="flex items-center">
                <input
                    type="hidden"
                    value={JSON.stringify(selectedWorkSubmissionId)}
                    {...restFieldProps}
                />
                {selectedWorkSubmissionSmall && (
                    <SmallWorkSubmissionCard
                        workSubmissionSmall={selectedWorkSubmissionSmall}
                        handleRemoveWorkSubmission={handleRemoveWorkWorkSubmission}
                    />
                )}
            </div>

            {selectedWorkSubmissionId === 0 && (
                <div className="">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="">
                                <SearchInput
                                    placeholder="Search work submissions..."
                                    context="Workspace General"
                                    inputClassName={`${inputClassName || ""}`}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="relative bg-white overflow-y-auto max-h-64">
                            <div className="grid">
                                {workSubmissionsSmallData?.data.map((workSubmission, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                    >
                                        <Button
                                            onClick={() =>
                                                handleAddWorkWorkSubmission(workSubmission.id)
                                            }
                                            className="bg-gray-50 text-black m-0 w-60 hover:bg-gray-50 hover:text-black"
                                        >
                                            <FontAwesomeIcon
                                                icon={faBoxArchive}
                                                className="small-icon px-2"
                                            />
                                            <div className="flex whitespace-nowrap">
                                                {(workSubmission?.title?.length || 0) > 20
                                                    ? `${workSubmission?.title?.slice(0, 20)}...`
                                                    : workSubmission?.title}
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

export default WorkSubmissionSelection;
