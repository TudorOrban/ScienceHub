import UsersAndTeamsSmallUI from "@/src/components/elements/UsersAndTeamsSmallUI";
import { GeneralInfo } from "@/src/types/infoTypes";
import { Submission } from "@/src/types/versionControlTypes";
import { faPaste } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type BrowseSubmissionItemProps = {
    submission: Submission;
};

/**
 * Submission Item for the Browse pages.
 */
const BrowseSubmissionItem: React.FC<BrowseSubmissionItemProps> = ({ submission }) => {
    return (
        <div className="w-full p-2 space-y-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm">
            <div>
                <div className="flex items-center pt-1">
                    <FontAwesomeIcon
                        icon={faPaste}
                        className="small-icon pl-2 pr-1 text-gray-700"
                    />

                    {submission?.link ? (
                        <Link href={submission?.link}>
                            <div className="max-w-[32rem] ml-1 hover:text-blue-600 font-semibold text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                                {submission.title || "No title"}
                            </div>
                        </Link>
                    ) : (
                        <div className="ml-1 font-semibold text-lg">
                            {submission.title || "No title"}
                        </div>
                    )}
                </div>
                {((submission.users?.length || 0) > 0 || (submission.teams?.length || 0) > 0) && (
                    <UsersAndTeamsSmallUI
                        users={submission.users || []}
                        teams={submission.teams || []}
                        className="ml-1 mt-3"
                    />
                )}
            </div>
        </div>
    );
};

export default BrowseSubmissionItem;
