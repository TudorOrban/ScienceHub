import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { Feature } from "@/types/infoTypes";

interface FeatureWithAction extends Feature {
    onClick: () => void;
    activated?: boolean;
    activatedString?: string;
}

interface ActionsButtonProps {
    actions?: FeatureWithAction[];
}

const ActionsButton: React.FC<ActionsButtonProps> = ({ actions }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    className={`actions-button shadow-sm hover:bg-gray-100 focus:bg-gray-200`}
                >
                    Actions
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="flex flex-col p-2 border border-gray-300 bg-white text-gray-800 text-lg shadow-md z-60"
                style={{ fontWeight: 500 }}
            >
                {actions?.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => action.onClick()}
                        className="flex items-center whitespace-nowrap px-2 py-1.5 text-gray-800"
                    >
                        <FontAwesomeIcon
                            icon={action.icon || faQuestion}
                            className={`small-icon mr-2 ${action.activated ? "text-blue-700" : ""}`}
                        />
                        {!action.activated ? (
                            <>{action.label}</>
                        ) : (
                            <div className="text-blue-700">{action.activatedString}</div>
                        )}
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    );
};

export default ActionsButton;
