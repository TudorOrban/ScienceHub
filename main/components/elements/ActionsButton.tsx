import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { Feature } from "@/types/infoTypes";

interface ActionsButtonProps {
    actions?: Feature[];
}

const ActionsButton: React.FC<ActionsButtonProps> = ({ actions }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    className={`actions-button shadow-sm hover:bg-gray-100 focus:bg-gray-800 focus:text-white`}
                >
                    Actions
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col p-2 border border-gray-300 bg-white text-gray-800 text-lg shadow-md z-60">
                {actions?.map((action, index) => (
                    <div key={index} className="flex items-center whitespace-nowrap px-2 py-1.5 text-gray-800">
                        <FontAwesomeIcon
                            icon={action.icon || faQuestion}
                            className="small-icon mr-2"
                        />
                        {action.label}
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
};

export default ActionsButton;
