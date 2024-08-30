import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
    faArrowDownShortWide,
    faArrowUpWideShort,
    faCalendar,
    faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { SearchOption } from "@/types/searchTypes";

type DateRangeFilterOptionsProps = {
    dateFilterOn: boolean;
    setDateFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDateOption: string;
    setSelectedDateOption: React.Dispatch<React.SetStateAction<string>>;
    startDate: Date | undefined;
    setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    endDate: Date | undefined;
    setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    availableDateOptions: SearchOption[];
};

/**
 * Date range filter for the Browse pages.
 */
const DateRangeFilterOptions: React.FC<DateRangeFilterOptionsProps> = ({
    dateFilterOn,
    setDateFilterOn,
    selectedDateOption,
    setSelectedDateOption,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    availableDateOptions,
}) => {
    return (
        <>
            {/* By Created At/Updated At */}
            <div className="pr-2 items-center">
                <div className="flex items-center pb-2">
                    <Checkbox
                        checked={dateFilterOn}
                        onCheckedChange={() => setDateFilterOn(!dateFilterOn)}
                        className="mt-0.5 bg-white text-gray-800"
                    />
                    <div className="pl-2 font-semibold text-sm">By Date Range of Work&apos;s:</div>
                </div>
                <div className="pl-6">
                    <Select
                        value={selectedDateOption}
                        onValueChange={(option: string) => {
                            setSelectedDateOption(option);
                        }}
                    >
                        <SelectTrigger className="w-[222px] flex whitespace-nowrap text-gray-800 font-semibold pl-2 pr-2">
                            <SelectValue>
                                {
                                    availableDateOptions?.find(
                                        (option) => option.value === selectedDateOption
                                    )?.label
                                }
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {availableDateOptions?.map((option, index) => (
                                <SelectItem key={index} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="pl-6 pr-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={"w-[222px] justify-start text-left font-normal"}
                            >
                                <FontAwesomeIcon
                                    icon={faCalendar}
                                    className="small-icon text-gray-600 p-1 mb-1"
                                />
                                {startDate ? (
                                    format(startDate, "PPP")
                                ) : (
                                    <span className="text-gray-600">Pick start date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                                className="bg-white"
                            />
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={"w-[222px] justify-start text-left font-normal"}
                            >
                                <FontAwesomeIcon
                                    icon={faCalendar}
                                    className="small-icon text-gray-600 p-1 mb-1"
                                />

                                {endDate ? (
                                    format(endDate, "PPP")
                                ) : (
                                    <span className="text-gray-600">Pick end date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                                className="bg-white"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </>
    );
};

export default DateRangeFilterOptions;
