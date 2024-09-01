import { WorkSmall } from "@/src/types/workTypes";
import {
    IconDefinition,
    faBoxArchive,
    faChartSimple,
    faClipboard,
    faCode,
    faDatabase,
    faFile,
    faFlask,
    faFolder,
    faMicrochip,
    faPaperPlane,
    faQuestion,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SmallWorkCardProps {
    workSmall: WorkSmall;
    handleRemoveWork?: (workId: string) => void;
}

interface WorkIcon {
    icon: IconDefinition;
    color: string;
}

const SmallWorkCard: React.FC<SmallWorkCardProps> = ({
    workSmall,
    handleRemoveWork,
}) => {
    return (
        <div className="flex items-center px-2 py-2 bg-gray-50 border border-gray-200 shadow-sm rounded-md">
            <FontAwesomeIcon
                icon={workTypeIconMap(workSmall.workType || "").icon}
                className="small-icon px-2"
                style={{
                    color: workTypeIconMap(workSmall.workType || "").color,
                }}
            />
            <div className="flex whitespace-nowrap font-semibold text-sm">
                {workSmall.title.length > 30
                    ? `${workSmall.title.slice(0, 40)}...`
                    : workSmall.title}
            </div>
            {handleRemoveWork && (
                <button
                    onClick={() => handleRemoveWork(workSmall.id.toString())}
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

export default SmallWorkCard;

export const workTypeIconMap = (workType: string): WorkIcon => {
    let workIcon: WorkIcon = { icon: faQuestion, color: "text-gray-700" };

    switch (workType) {
        case "Experiment":
            workIcon = { icon: faFlask, color: "#2E3A87" };
            break;
        case "Dataset":
            workIcon = { icon: faDatabase, color: "#1A8E34" };
            break;
        case "Data Analysis":
            workIcon = { icon: faChartSimple, color: "#8B2DAE" };
            break;
        case "AI Model":
            workIcon = { icon: faMicrochip, color: "#DAA520" };
            break;
        case "Code Block":
            workIcon = { icon: faCode, color: "#C82333" };
            break;
        case "Paper":
            workIcon = { icon: faClipboard, color: "#4A4A4A" };
            break;
        case "Folder":
            workIcon = { icon: faFolder, color: "#4A4A4A" };
            break;
        case "File":
            workIcon = { icon: faFile, color: "#4A4A4A" };
            break;
        case "":
            workIcon = { icon: faQuestion, color: "#222222" };
            break;
    }
    return workIcon;
};
