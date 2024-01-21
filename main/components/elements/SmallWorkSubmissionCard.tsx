import { WorkSubmissionSmall } from "@/types/versionControlTypes";
import { faPaste, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SmallWorkSubmissionCardProps {
    workSubmissionSmall: WorkSubmissionSmall;
    handleRemoveWorkSubmission?: (workId: number) => void;
}

const SmallWorkSubmissionCard: React.FC<SmallWorkSubmissionCardProps> = ({
    workSubmissionSmall,
    handleRemoveWorkSubmission,
}) => {
    return (
        <div className="flex items-center h-10 px-2 py-3 bg-gray-50 border border-gray-200 shadow-sm rounded-md ">
            <FontAwesomeIcon icon={faPaste} className="small-icon pr-2" />
            <div className="flex whitespace-nowrap font-semibold text-sm">
                {(workSubmissionSmall?.title?.length || 0) > 20
                    ? `${workSubmissionSmall?.title?.slice(0, 27)}...`
                    : workSubmissionSmall.title}
            </div>
            {handleRemoveWorkSubmission && (
                <button
                    onClick={() =>
                        handleRemoveWorkSubmission(workSubmissionSmall.id)
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

export default SmallWorkSubmissionCard;
