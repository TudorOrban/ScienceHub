import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownShortWide, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";
import { SearchOption } from "@/types/searchTypes";

type SortOptionsProps = {
    sortOption: string;
    descending: boolean;
    setSortOption: React.Dispatch<React.SetStateAction<string>>;
    setDescending: React.Dispatch<React.SetStateAction<boolean>>;
    availableSortOptions: SearchOption[];
};

/**
 * Sort selection for the Browse pages.
 */
const SortOptions: React.FC<SortOptionsProps> = ({
    sortOption,
    descending,
    setSortOption,
    setDescending,
    availableSortOptions,
}) => {
    return (
        <>
            <div className="flex font-semibold text-lg pt-2">Sort Options:</div>
            <div className="flex items-center border-b border-gray-300 py-2 pr-2">
                <Select
                    value={sortOption}
                    onValueChange={(option: string) => {
                        setSortOption(option);
                    }}
                >
                    <SelectTrigger className="flex whitespace-nowrap text-gray-800 font-semibold pl-2 pr-2">
                        <SelectValue>
                            <SelectValue>
                                {
                                    availableSortOptions?.find(
                                        (option) => option.value === sortOption
                                    )?.label
                                }
                            </SelectValue>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {availableSortOptions?.map((option, index) => (
                            <SelectItem
                                key={index}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {descending ? (
                    <Button
                        variant="default"
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800 w-9 h-9"
                        onClick={() => setDescending(!descending)}
                    >
                        <FontAwesomeIcon icon={faArrowUpWideShort} className="small-icon" />
                    </Button>
                ) : (
                    <Button
                        variant="default"
                        className="bg-white text-gray-800 hover:bg-white hover:text-gray-800 w-9 h-9"
                        onClick={() => setDescending(!descending)}
                    >
                        <FontAwesomeIcon icon={faArrowDownShortWide} className="small-icon" />
                    </Button>
                )}
            </div>
        </>
    );
};

export default SortOptions;
