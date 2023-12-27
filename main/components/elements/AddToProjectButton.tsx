import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Feature } from "@/types/infoTypes";

interface AddToProjectButtonProps {
    addOptions?: Feature[];
}

const AddToProjectButton: React.FC<AddToProjectButtonProps> = ({
    addOptions,
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className={`standard-write-button shadow-sm hover:bg-blue-700`}>
                    <FontAwesomeIcon
                        icon={faPlus}
                        className="small-icon mr-0 lg:mr-2"
                    />
                    <div className="hidden lg:block">Add to Project</div>
                </button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col py-2 px-3 border border-gray-300 bg-white text-gray-800 text-lg shadow-md z-60">
                {addOptions?.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center whitespace-nowrap px-2 py-1.5 text-gray-800"
                    >
                        {/* <FontAwesomeIcon
                            icon={option.icon || faQuestion}
                            className="small-icon mr-2"
                        /> */}
                        {option.label}
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
};

export default AddToProjectButton;
