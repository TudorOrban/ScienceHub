import { SearchOption } from "@/types/searchTypes";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type StatusFilterOptionsProps = {
    statusFilterOn: boolean;
    setStatusFilterOn: React.Dispatch<React.SetStateAction<boolean>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    availableStatusOptions: SearchOption[];
};

/**
 * Status filter for the Browse pages.
 */
const StatusFilterOptions: React.FC<StatusFilterOptionsProps> = ({
    statusFilterOn,
    setStatusFilterOn,
    status,
    setStatus,
    availableStatusOptions,
}) => {
    return (
        <div className="my-2 space-x-2 pb-2 pr-4">
            <div className="flex items-center pt-2 pb-2">
                <Checkbox
                    checked={statusFilterOn}
                    onCheckedChange={() => setStatusFilterOn(!statusFilterOn)}
                />
                <div className="font-semibold whitespace-nowrap text-sm pl-2">By Status:</div>
            </div>
            <Select value={status} onValueChange={(newStatus: string) => setStatus(newStatus)}>
                <div className="pl-4">
                    <SelectTrigger
                        className="w-[220px] font-semibold text-gray-800 outline-0"
                        placeholder="By Status"
                    >
                        <SelectValue>
                            {
                                availableStatusOptions?.find((option) => option.value === status)
                                    ?.label
                            }
                        </SelectValue>
                    </SelectTrigger>
                </div>
                <SelectContent>
                    <div className="font-semibold text-gray-800 text-base p-1">Select Status</div>
                    {availableStatusOptions?.map((option, index) => (
                        <SelectItem key={index} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default StatusFilterOptions;
