import { ProjectSubmissionSmall } from "@/src/types/versionControlTypes";
import { faPaste, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SmallProjectSubmissionCardProps {
    projectSubmissionSmall: ProjectSubmissionSmall;
    handleRemoveProjectSubmission?: (projectId: number) => void;
}

const SmallProjectSubmissionCard: React.FC<SmallProjectSubmissionCardProps> = ({
    projectSubmissionSmall,
    handleRemoveProjectSubmission,
}) => {
    return (
        <div className="flex items-center h-10 px-2 py-3 bg-gray-50 border border-gray-200 shadow-sm rounded-md ">
            <FontAwesomeIcon icon={faPaste} className="small-icon pr-2" />
            <div className="flex whitespace-nowrap font-semibold text-sm">
                {(projectSubmissionSmall?.title?.length || 0) > 20
                    ? `${projectSubmissionSmall?.title?.slice(0, 27)}...`
                    : projectSubmissionSmall.title}
            </div>
            {handleRemoveProjectSubmission && (
                <button
                    onClick={() =>
                        handleRemoveProjectSubmission(projectSubmissionSmall.id)
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
