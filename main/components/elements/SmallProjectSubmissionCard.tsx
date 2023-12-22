import { ProjectSubmissionSmall } from "@/types/versionControlTypes";
import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SmallProjectSubmissionCardProps {
    projectSubmissionSmall: ProjectSubmissionSmall;
    handleRemoveProjectSubmission?: (projectId: string) => void;
}

const SmallProjectSubmissionCard: React.FC<SmallProjectSubmissionCardProps> = ({
    projectSubmissionSmall,
    handleRemoveProjectSubmission,
}) => {
    return (
        <div className="hidden lg:flex items-center h-10 px-2 py-3 bg-gray-50 border border-gray-200 shadow-sm rounded-md ">
            <FontAwesomeIcon icon={faBoxArchive} className="small-icon pr-2" />
            <div className="flex whitespace-nowrap font-semibold text-sm">
                {(projectSubmissionSmall?.title?.length || 0) > 20
                    ? `${projectSubmissionSmall?.title?.slice(0, 27)}...`
                    : projectSubmissionSmall.title}
            </div>
            {handleRemoveProjectSubmission && (
                <button
                    onClick={() =>
                        handleRemoveProjectSubmission(projectSubmissionSmall.id.toString())
                    }
                    className="bg-gray-50 text-black pl-2 pr-1 hover:bg-gray-50"
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="small-icon text-gray-500 hover:text-red-700"
                    />
                </button>
            )}
        </div>
    );
};

export default SmallProjectSubmissionCard;
