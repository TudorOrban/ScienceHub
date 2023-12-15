import { ToastType } from "@/contexts/general/ToastsContext";
import { faCheck, faQuestion, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ToastProps {
    toast: ToastType;
    index?: number;
    bottomPosition?: number;
    onRemove?: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, index, bottomPosition, onRemove }) => {
    const indexBottomPosition = (index || 0) * 80 + 40;

    return (
        <div
            className={`absolute right-10 z-60`}
            style={{ bottom: `${bottomPosition || indexBottomPosition}px`, minWidth: "180px", maxWidth: "420px" }}
        >
            <div className="flex items-start w-full bg-white border border-gray-300 rounded-md shadow-md pl-4 py-3">
                <div
                    className={` flex items-center justify-center flex-shrink-0 w-8 h-8 mt-2 border border-gray-400 rounded-full shadow-sm text-white mr-3 ${
                        toast.outcome === "success"
                            ? "bg-green-600"
                            : toast.outcome === "error"
                            ? "bg-red-600"
                            : toast.outcome === "loading"
                            ? "bg-gray-800"
                            : "bg-white"
                    }`}
                >
                    <FontAwesomeIcon
                        icon={
                            toast.outcome === "success"
                                ? faCheck
                                : toast.outcome === "error"
                                ? faXmark
                                : toast.outcome === "loading"
                                ? faSpinner
                                : faQuestion
                        }
                        className="small-icon"
                    />
                </div>
                <div>
                    {toast.title && <p className="font-semibold">{toast.title}</p>}
                    {toast.subtitle && <p className="text-gray-800 text-sm">{toast.subtitle}</p>}
                </div>
                <button onClick={() => onRemove?.()} className="relative right-0 top-1 w-3 h-3 ml-6 mr-4">
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="text-gray-600 hover:text-red-700 mb-1"
                    />
                </button>
            </div>
        </div>
    );
};

export default Toast;
