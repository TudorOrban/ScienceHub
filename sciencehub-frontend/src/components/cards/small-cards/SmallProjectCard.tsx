import { ProjectSmall } from "@/src/types/projectTypes";
import { truncateText } from "@/src/utils/functions";
import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SmallProjectCardProps {
    projectSmall: ProjectSmall;
    handleAddProject?: (project: ProjectSmall) => void;
    handleRemoveProject?: (projectId: number) => void;
    className?: string;
}

const SmallProjectCard: React.FC<SmallProjectCardProps> = ({
    projectSmall,
    handleAddProject,
    handleRemoveProject,
    className,
}) => {
    return (
        <div
            className={`flex items-center w-48 h-12 px-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 shadow-sm rounded-md ${
                className || ""
            }`}
        >
            <button
                onClick={() => handleAddProject && handleAddProject(projectSmall)}
                className="flex items-center w-full h-full whitespace-nowrap font-semibold text-sm"
            >
                <FontAwesomeIcon icon={faBoxArchive} className="small-icon px-2" />
                {truncateText(projectSmall?.title, 13)}
            </button>
            {handleRemoveProject && (
                <button
                    onClick={() => handleRemoveProject(projectSmall.id)}
                    className="bg-gray-50 text-black pl-2 pr-1"
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

export default SmallProjectCard;
