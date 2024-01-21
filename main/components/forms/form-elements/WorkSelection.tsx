import { faBoxArchive, faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";
import { Button } from "../../ui/button";
import SearchInput from "../../complex-elements/search-inputs/SearchInput";
import { useWorkSelectionContext } from "@/contexts/selections/WorkSelectionContext";
import { WorkSmall } from "@/types/workTypes";
import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useWorksSmallSearch } from "@/hooks/fetch/search-hooks/works/useWorksSmallSearch";
import { getObjectNames } from "@/config/getObjectNames";

import dynamic from "next/dynamic";
import { shallowEqual } from "@/utils/functions";
import { workTypeIconMap } from "@/components/elements/SmallWorkCard";
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

type ProjectSelectionProps = {
    restFieldProps: RestFieldProps;
    createNewOn?: boolean;
    inputClassName?: string;
    initialWorkType?: string;
    initialWorkId?: number;
};

const WorkSelection: React.FC<ProjectSelectionProps> = ({
    restFieldProps,
    createNewOn,
    inputClassName,
    initialWorkType,
    initialWorkId,
}) => {
    // State for holding selected project's small info (id name title)
    const [selectedWorkSmall, setSelectedWorkSmall] = useState<WorkSmall>();

    // Contexts
    // - Current user
    const userId = useUserId();

    const {
        selectedWorkType,
        setSelectedWorkType,
        selectedWorkId,
        setSelectedWorkId,
        projectId,
        setProjectId,
    } = useWorkSelectionContext();

    const workTypeInfo = getObjectNames({ label: selectedWorkType });

    // Custom hooks
    const worksSmallData = useWorksSmallSearch({
        tableName: workTypeInfo?.tableName || "",
        enabled: !!selectedWorkType,
        context: "Reusable",
    });

    // Effects
    // - Initial work type and id
    useEffect(() => {
        if (initialWorkType || initialWorkId) {
            if (initialWorkType && initialWorkType !== selectedWorkType) {
                setSelectedWorkType(initialWorkType);
            }
            if (initialWorkId && initialWorkId !== selectedWorkId) {
                setSelectedWorkId(initialWorkId);
            }

            const foundWork = worksSmallData?.data.filter(
                (project) => project.id === Number(initialWorkId)
            )[0];

            if (foundWork && !shallowEqual(foundWork, selectedWorkSmall)) {
                setSelectedWorkSmall(foundWork);
            }
        }
    }, [initialWorkType, initialWorkId, worksSmallData]);

    // - New work creation
    useEffect(() => {
        if (createNewOn) {
            setSelectedWorkId(0);
        }
    }, [createNewOn]);

    // Handle work selection
    const handleAddWork = (workId: number) => {
        setSelectedWorkId(workId);

        const selectedWorkSmall = worksSmallData?.data.find((work) => work.id === workId);
        if (selectedWorkSmall) {
            setSelectedWorkSmall(selectedWorkSmall);
            setProjectId(selectedWorkSmall?.projects?.[0].id);
        }
    };

    const handleRemoveWork = (workId: number) => {
        setSelectedWorkId(0);
        setSelectedWorkSmall(undefined);
        setProjectId(undefined);
    };

    return (
        <div
            className="flex items-center"
        >
            <div className="flex items-center">
                <input type="hidden" value={JSON.stringify(selectedWorkId)} {...restFieldProps} />
                {selectedWorkSmall && (
                    <div className="flex items-center pr-2 bg-gray-50 border border-gray-200 shadow-sm rounded-md">
                        <FontAwesomeIcon icon={workTypeIconMap(selectedWorkType).icon || faQuestion} className="small-icon px-2" />
                        <div className="flex whitespace-nowrap font-semibold text-sm">
                            {selectedWorkSmall.title.length > 30
                                ? `${selectedWorkSmall.title.slice(0, 40)}...`
                                : selectedWorkSmall.title}
                        </div>
                        <Button
                            onClick={() => handleRemoveWork(selectedWorkId)}
                            className="bg-gray-50 text-black pl-2 pr-1 py-1 hover:bg-gray-50"
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="small-icon text-gray-500 hover:text-red-700"
                            />
                        </Button>
                    </div>
                )}
            </div>

            {selectedWorkId === 0 && (
                <div className="">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="">
                                <SearchInput
                                    placeholder={`Search ${workTypeInfo?.plural}`}
                                    context="Workspace General"
                                    inputClassName={`${inputClassName || ""}`}
                                />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="relative bg-white overflow-y-auto max-h-64">
                            <div className="grid">
                                {Array.isArray(worksSmallData.data) &&
                                    worksSmallData.data?.map((work, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                        >
                                            <Button
                                                onClick={() => handleAddWork(work.id)}
                                                className="bg-gray-50 text-black m-0 w-60 hover:bg-gray-50 hover:text-black"
                                            >
                                                <FontAwesomeIcon
                                                    icon={workTypeIconMap(selectedWorkType).icon || faQuestion}
                                                    className="small-icon px-2"
                                                />
                                                <div className="flex whitespace-nowrap">
                                                    {work.title.length > 20
                                                        ? `${work.title.slice(0, 20)}...`
                                                        : work.title}
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

export default WorkSelection;
