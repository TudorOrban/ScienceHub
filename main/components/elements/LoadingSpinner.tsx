import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoadingSpinner = () => {
    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75">
            <FontAwesomeIcon icon={faSpinner} className="w-6 h-6 text-gray-700 animate-spin" />
        </div>
    );
};

export default LoadingSpinner;
