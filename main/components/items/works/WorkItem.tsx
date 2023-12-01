import { WorkInfo } from "@/types/infoTypes";
import { faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useDeleteGeneralObject } from "@/app/hooks/delete/useDeleteGeneralObject";
import { useContext } from "react";
import { DeleteModeContext } from "@/app/contexts/general/DeleteModeContext";
import { constructLink } from "@/utils/functions";
import { Skeleton } from "@/components/ui/skeleton";
import { getObjectNames } from "@/utils/getObjectNames";

const ConfirmDialog = dynamic(
    () => import("@/components/elements/ConfirmDialog")
);

type WorkItemProps = {
    workInfo: WorkInfo;
    workType?: string;
    index?: number;
    isLoading?: boolean;
    shouldPush?: boolean;
};

const WorkItem: React.FC<WorkItemProps> = ({
    workInfo,
    workType,
    index,
    isLoading,
    shouldPush,
}) => {
    const { href, shouldRenderLink } = constructLink(
        (workInfo.users || []).map((user) => user.id),
        (workInfo.teams || []).map((team) => team.id),
        workInfo.link
    );

    // Delete
    const deleteModeContext = useContext(DeleteModeContext);
    if (!deleteModeContext) {
        throw new Error("DeleteModeContext must be used within a provider");
    }
    const { isDeleteModeOn, toggleDeleteMode } = deleteModeContext;
    const deleteGeneral = useDeleteGeneralObject(workInfo.workType || "");

    const workTypeInfo = getObjectNames({ tableName: workInfo.workType });

    return (
        <div className="w-full text-lg text-gray-900 p-2">
            <div className="flex items-center">
                {index && <div>{index + "."}</div>}

                {workInfo.icon && (
                    <FontAwesomeIcon
                        icon={workInfo.icon}
                        className="pl-2 pr-0.5 text-gray-700"
                        style={{
                            width: "11px",
                            marginBottom: "1px",
                            color: workInfo.iconColor,
                        }}
                    />
                )}

                {!isLoading ? (
                    <>
                        {shouldPush ? (
                            <Link
                                href={
                                    `${workTypeInfo?.linkName}/` +
                                    (workInfo.id?.toString() || "")
                                }
                            >
                                <div className="max-w-[32rem] ml-1 hover:text-blue-600 font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    {workInfo.title || "No title"}
                                </div>
                            </Link>
                        ) : (
                            <>
                                {shouldRenderLink ? (
                                    <Link href={href || ""}>
                                        <div className="max-w-[32rem] ml-1 hover:text-blue-600 font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                                            {workInfo.title || "No title"}
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="ml-1 font-semibold">
                                        {workInfo.title || "No title"}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <Skeleton className="w-64 h-6 bg-gray-300" />
                )}

                {workInfo.public !== null && workInfo.public !== undefined ? (
                    <div className="flex items-center ml-2 p-1 bg-gray-50 border border-gray-200 rounded-md">
                        <FontAwesomeIcon
                            icon={workInfo.public ? faGlobe : faLock}
                            className={
                                workInfo.public
                                    ? "text-green-700"
                                    : "text-gray-600"
                            }
                            style={{ width: workInfo.public ? "12px" : "10px" }}
                        />
                        <div className=" text-gray-700 text-sm pl-1">
                            {workInfo.public ? "Public" : "Private"}
                        </div>
                    </div>
                ) : null}
                <div className="pl-2">
                    {isDeleteModeOn && (
                        <ConfirmDialog
                            objectId={Number(workInfo.id || 0)}
                            onDelete={() =>
                                deleteGeneral.handleDeleteObject(
                                    Number(workInfo.id || 0)
                                )
                            }
                            objectType={workInfo.workType || "work"}
                        />
                    )}
                </div>
            </div>
            {workInfo.description && (
                <div className="text-gray-700 text-base">
                    {workInfo.description}
                </div>
            )}
        </div>
    );
};

export default WorkItem;
