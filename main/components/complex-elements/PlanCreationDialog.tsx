import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

interface PlanCreationDialogProps {
    startDate: Date;
    endDate: Date;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
    onClose: () => void;
    onSave: (title: string, description: string, isPublic: boolean) => void;
    position: { top: number; left: number };
}

const PlanCreationDialog: React.FC<PlanCreationDialogProps> = ({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    onClose,
    onSave,
    position,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    const handleSubmit = () => {
        onSave(title, description, isPublic);
        onClose(); // Close dialog after save
    };

    return (
        <div
            style={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            className="bg-white shadow-lg border border-gray-200 rounded-lg p-4 w-96"
        >
            {/* Date selection for start date */}
            <div className="mb-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="w-[222px] justify-start text-left font-normal"
                        >
                            <FontAwesomeIcon
                                icon={faCalendar}
                                className="small-icon text-gray-600 p-1 mb-1"
                            />
                            {startDate ? (
                                format(startDate, "PPP")
                            ) : (
                                <span className="text-gray-600">
                                    Pick start date
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                                if (date) setStartDate(date);
                            }}
                            initialFocus
                            className="bg-white"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Date selection for end date */}
            <div className="mb-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="w-[222px] justify-start text-left font-normal"
                        >
                            <FontAwesomeIcon
                                icon={faCalendar}
                                className="small-icon text-gray-600 p-1 mb-1"
                            />
                            {endDate ? (
                                format(endDate, "PPP")
                            ) : (
                                <span className="text-gray-600">
                                    Pick end date
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                                if (date) setEndDate(date);
                            }}
                            initialFocus
                            className="bg-white"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="mb-4">
                <label
                    htmlFor="title"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="description"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4 flex items-center">
                <label
                    htmlFor="public"
                    className="block text-gray-700 text-sm font-bold mr-2"
                >
                    Public
                </label>
                <input
                    id="public"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="leading-tight"
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleSubmit}
                >
                    Save
                </button>
                <button
                    className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PlanCreationDialog;
