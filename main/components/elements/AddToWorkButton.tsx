import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Feature } from "@/types/infoTypes";

interface AddToWorkButtonProps {
    addOptions?: Feature[];
}

const AddToWorkButton: React.FC<AddToWorkButtonProps> = ({ addOptions }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className={`standard-write-button shadow-sm hover:bg-blue-700`}>
                    <FontAwesomeIcon icon={faPlus} className="small-icon mr-0 lg:mr-2" />
                    <div className="hidden lg:block">Add to Work</div>
                </button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col py-2 px-3 border border-gray-300 bg-white text-gray-800 shadow-md z-50">
                {addOptions?.map((option, index) => (
                    <div
                        key={index}
                        className="flex items-center font-semibold whitespace-nowrap px-2 py-1.5 text-gray-800"
                    >
                        {option.label}
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    );
};

export default AddToWorkButton;
