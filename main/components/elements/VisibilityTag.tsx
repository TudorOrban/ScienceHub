import { faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface VisibilityTagProps {
    isPublic?: boolean;
}

const VisibilityTag: React.FC<VisibilityTagProps> = ({ isPublic }) => {
    if (isPublic !== null && isPublic !== undefined) {
        return (
            <div className="flex items-center ml-3 px-2 py-1 mt-1 bg-white border border-gray-200 rounded-md">
                <FontAwesomeIcon
                    icon={isPublic ? faGlobe : faLock}
                    className={isPublic ? "text-green-700" : "text-gray-600 mb-0.5"}
                    style={{
                        width: isPublic ? "12px" : "10px",
                    }}
                />
                <div className="text-gray-800 text-sm pl-1.5">
                    {isPublic ? "Public" : "Private"}
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default VisibilityTag;
