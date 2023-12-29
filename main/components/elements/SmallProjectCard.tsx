import { ProjectSmall } from "@/types/projectTypes";
import { faBoxArchive, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SmallProjectCardProps {
    projectSmall: ProjectSmall;
    handleRemoveProject?: (projectId: string) => void;
}

const SmallProjectCard: React.FC<SmallProjectCardProps> = ({
    projectSmall,
    handleRemoveProject,
}) => {
    return (
        <div className="flex items-center h-10 px-2 py-3 bg-gray-50 border border-gray-200 shadow-sm rounded-md ">
            <FontAwesomeIcon icon={faBoxArchive} className="small-icon pr-2" />
            <div className="flex whitespace-nowrap font-semibold text-sm">
                {projectSmall.title.length > 20
                    ? `${projectSmall.title.slice(0, 27)}...`
                    : projectSmall.title}
            </div>
            {handleRemoveProject && (
                <button
                    onClick={() =>
                        handleRemoveProject(projectSmall.id.toString())
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

export default SmallProjectCard;
