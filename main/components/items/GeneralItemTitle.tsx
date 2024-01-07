import { DeleteModeContext } from "@/contexts/general/DeleteModeContext";
import { GeneralInfo } from "@/types/infoTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { useDeleteGeneralObject } from "@/hooks/delete/useDeleteGeneralObject";
import { constructLink } from "@/utils/functions";
import { getObjectNames } from "@/config/getObjectNames";
import dynamic from "next/dynamic";
import VisibilityTag from "../elements/VisibilityTag";
import Link from "next/link";
const ConfirmDialog = dynamic(() => import("../elements/ConfirmDialog"));
const Skeleton = dynamic(() => import("../ui/skeleton").then((mod) => mod.Skeleton));

type GeneralItemProps = {
    generalInfo: GeneralInfo;
    columns?: string[];
    index?: number;
    isLoading?: boolean;
};

const GeneralItemTitle: React.FC<GeneralItemProps> = ({ generalInfo, index, isLoading }) => {
    const generalTypeInfo = getObjectNames({ tableName: generalInfo.itemType });

    // Delete
    const deleteModeContext = useContext(DeleteModeContext);
    if (!deleteModeContext) {
        throw new Error("DeleteModeContext must be used within a provider");
    }
    const { isDeleteModeOn, toggleDeleteMode } = deleteModeContext;
    const deleteGeneral = useDeleteGeneralObject(generalTypeInfo?.tableName || "");

    return (
        <div className="p-2">
            {!isLoading ? (
                <div className="text-gray-900">
                    <div className="flex items-center">
                        {index && <div>{index + "."}</div>}
                        {generalInfo.icon && (
                            <FontAwesomeIcon
                                icon={generalInfo.icon}
                                className="pl-2 pr-0.5 text-gray-700"
                                style={{
                                    width: "12px",
                                    color: generalInfo.iconColor,
                                }}
                            />
                        )}

                        <>
                            {!!generalInfo.link ? (
                                <Link href={generalInfo.link}>
                                    <div className="max-w-[12rem] md:max-w-[18rem] lg:max-w-[24rem] ml-1 hover:text-blue-600 hover:underline hover:underline-offset-1 font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                                        {generalInfo.title || "No title"}
                                    </div>
                                </Link>
                            ) : (
                                <div className="max-w-[12rem] md:max-w-[18rem] lg:max-w-[24rem] ml-1 font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                                    {generalInfo.title || "No title"}
                                </div>
                            )}
                        </>
                        <VisibilityTag isPublic={generalInfo.public} />
                        {isDeleteModeOn && (
                            <ConfirmDialog
                                objectId={Number(generalInfo.id || 0)}
                                onDelete={() =>
                                    deleteGeneral.handleDeleteObject(Number(generalInfo.id || 0))
                                }
                                objectType={generalInfo.itemType || ""}
                            />
                        )}
                    </div>
                    <div
                        className={`max-w-[12rem] md:max-w-[18rem] lg:max-w-[24rem] whitespace-nowrap overflow-hidden overflow-ellipsis text-base text-gray-800 ${
                            !generalInfo.description && "text-white"
                        }`}
                    >
                        {generalInfo.description || "blank"}
                    </div>
                </div>
            ) : (
                <Skeleton className="w-64 h-6 bg-gray-300" />
            )}
        </div>
    );
};

export default GeneralItemTitle;
