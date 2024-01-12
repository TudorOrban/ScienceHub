import UsersAndTeamsSmallUI from "@/components/elements/UsersAndTeamsSmallUI";
import { WorkInfo } from "@/types/infoTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
type BrowseWorkItemProps = {
    workInfo: WorkInfo;
    workType?: string;
};

const BrowseWorkItem: React.FC<BrowseWorkItemProps> = ({ workInfo, workType }) => {
    return (
        <div className="w-full p-2 space-y-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm">
            <div className="flex items-center text-xl">
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

                {workInfo?.link ? (
                    <Link href={workInfo?.link}>
                        <div className="max-w-[32rem] ml-1 hover:text-blue-600 font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {workInfo.title || "No title"}
                        </div>
                    </Link>
                ) : (
                    <div className="ml-1 font-semibold">{workInfo.title || "No title"}</div>
                )}
            </div>
            {((workInfo.users?.length || 0) > 0 || (workInfo.teams?.length || 0) > 0) && (
                <UsersAndTeamsSmallUI users={workInfo.users || []} teams={workInfo.teams || []} className="text-base" />
            )}
            {workInfo.description && (
                <p className="text-gray-700 text-base pl-2">{workInfo.description}</p>
            )}
        </div>
    );
};

export default BrowseWorkItem;
