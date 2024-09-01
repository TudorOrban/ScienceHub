import SmallMetricsPanel from "@/src/components/complex-elements/SmallMetricsPanel";
import ActionButton from "@/src/components/elements/ActionButton";
import { workTypeIconMap } from "@/src/components/cards/small-cards/SmallWorkCard";
import UsersAndTeamsSmallUI from "@/src/components/elements/UsersAndTeamsSmallUI";
import { Work } from "@/src/types/workTypes";
import {
    faEllipsis,
    faPlus,
    faQuoteRight,
    faShare,
    faUpLong,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

type BrowseWorkItemProps = {
    work: Work;
};

/**
 * Work Item for the Browse pages.
 */
const BrowseWorkItem: React.FC<BrowseWorkItemProps> = ({ work }) => {
    const workIcon = workTypeIconMap(work.workType);

    return (
        <div className="flex items-start justify-between w-full p-3 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm">
            {/* Left side */}
            <div>
                <div className="flex items-center pt-1">
                    <FontAwesomeIcon
                        icon={workIcon.icon}
                        className="small-icon pl-2 pr-1 text-gray-700"
                        style={{
                            color: workIcon.color,
                        }}
                    />

                    {work?.link ? (
                        <Link href={work?.link}>
                            <div className="max-w-[32rem] ml-1 hover:text-blue-600 font-semibold text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                                {work.title || "No title"}
                            </div>
                        </Link>
                    ) : (
                        <div className="ml-1 font-semibold text-lg">{work.title || "No title"}</div>
                    )}
                </div>
                {((work.users?.length || 0) > 0 || (work.teams?.length || 0) > 0) && (
                    <UsersAndTeamsSmallUI
                        users={work.users || []}
                        teams={work.teams || []}
                        className="ml-1 mt-3"
                    />
                )}
            </div>

            {/* Right side */}
            <div className="flex flex-col">
                <SmallMetricsPanel
                    researchScore={work?.researchScore}
                    hIndex={work?.hIndex}
                    citationsCount={work?.citationsCount}
                    isLoading={false}
                />
                <div className="flex justify-end space-x-3 mt-3">
                    <ActionButton
                        icon={faEllipsis}
                        tooltipText={"More Actions"}
                        className="w-8 h-8"
                    />
                    <ActionButton icon={faUpLong} tooltipText={"Upvote"} className="w-8 h-8" />
                    <ActionButton icon={faQuoteRight} tooltipText={"Cite"} className="w-8 h-8" />
                    <ActionButton icon={faShare} tooltipText={"Share"} className="w-8 h-8" />
                    <button className="bg-blue-600 text-white whitespace-nowrap lg:mt-0 flex-shrink-0 w-8 h-8 rounded-md hover:bg-blue-700">
                        <FontAwesomeIcon icon={faPlus} className="small-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrowseWorkItem;
