import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";
import { Button } from "../../ui/button";
import SearchInput from "../../complex-elements/SearchInput";
import { useWorkSelectionContext } from "@/app/contexts/selections/WorkSelectionContext";
import { WorkSmall } from "@/types/workTypes";
import { useUserId } from "@/app/contexts/current-user/UserIdContext";
import { useWorksSmallSearch } from "@/app/hooks/fetch/search-hooks/works/useWorksSmallSearch";
import { getObjectNames } from "@/utils/getObjectNames";

import dynamic from "next/dynamic";
import { shallowEqual } from "@/utils/functions";
const Popover = dynamic(() =>
    import("@/components/ui/popover").then((mod) => mod.Popover)
);
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
    initialWorkId?: string;
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
    } = useWorkSelectionContext();

    const workTypeInfo = getObjectNames({ label: selectedWorkType });
    const tableName = workTypeInfo?.tableName || "";

    const isEnabled =
        selectedWorkType !== null &&
        selectedWorkType !== undefined &&
        selectedWorkType !== "";


    // Custom hooks
    const worksSmallData = useWorksSmallSearch({
        tableName: tableName,
        extraFilters: {},
        enabled: isEnabled,
        context: "Workspace General",
    });

    // Effects
    // - Initial work type and id
    useEffect(() => {
        if (initialWorkType && initialWorkId) {
            if (initialWorkType !== selectedWorkType) {
                setSelectedWorkType(initialWorkType);
            }
            if (initialWorkId !== selectedWorkId) {
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
            setSelectedWorkId("");
        }
    }, [createNewOn]);

    // Handle work selection
    const handleAddWork = (workId: string) => {
        setSelectedWorkId(workId);

        const selectedWorkSmall = worksSmallData?.data.find(
            (work) => work.id === Number(workId)
        );
        if (selectedWorkSmall) {
            setSelectedWorkSmall(selectedWorkSmall);
        }
    };

    const handleRemoveWork = (workId: string) => {
        setSelectedWorkId("");
        setSelectedWorkSmall(undefined);
    };

    return (
        <div
            className="flex items-center mt-4"
            style={{
                height: "10px",
            }}
        >
            <div className="flex items-center">
                <input
                    type="hidden"
                    value={JSON.stringify(selectedWorkId)}
                    {...restFieldProps}
                />
                <div className="flex items-center">
                    {selectedWorkSmall && (
                        <div className="flex items-center ml-1 pr-2  bg-gray-50 border border-gray-200 shadow-sm rounded-md">
                            <FontAwesomeIcon
                                icon={faBoxArchive}
                                className="small-icon px-2"
                            />
                            <div className="flex whitespace-nowrap font-semibold text-sm">
                                {selectedWorkSmall.title.length > 30
                                    ? `${selectedWorkSmall.title.slice(
                                          0,
                                          40
                                      )}...`
                                    : selectedWorkSmall.title}
                            </div>
                            <Button
                                onClick={() =>
                                    handleRemoveWork(selectedWorkId.toString())
                                }
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
            </div>

            {selectedWorkId === "" && (
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
                                                onClick={() =>
                                                    handleAddWork(
                                                        work.id.toString()
                                                    )
                                                }
                                                className="bg-gray-50 text-black m-0 w-60 hover:bg-gray-50 hover:text-black"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faBoxArchive}
                                                    className="small-icon px-2"
                                                />
                                                <div className="flex whitespace-nowrap">
                                                    {work.title.length > 20
                                                        ? `${work.title.slice(
                                                              0,
                                                              20
                                                          )}...`
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
