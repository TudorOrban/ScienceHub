import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar } from "../../ui/calendar";
import { useState } from "react";
import { faCalendar, faQuestion, faXmark } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import Popover from "../../light-simple-elements/Popover";
import { Plan } from "@/types/utilsTypes";
import UsersSelection from "../selections/UsersSelection";
import { User } from "@/types/userTypes";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";

interface PlanCreationDialogProps {
    useExistingPlan?: boolean;
    plan?: Plan;
    startDate: Date;
    endDate: Date;
    setStartDate: (date: Date) => void;
    setEndDate: (date: Date) => void;
    onClose: () => void;
    onCreate: (
        startDate: Date,
        endDate: Date,
        title: string,
        description: string,
        isPublic: boolean,
        users: string[],
        tags: string[],
        color: string,
        planId?: number
    ) => void;
    onDelete?: (planId: number) => void;
    position: { top: number; left: number };
}

const PlanCreationDialog: React.FC<PlanCreationDialogProps> = ({
    useExistingPlan,
    plan,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    onClose,
    onCreate,
    onDelete,
    position,
}) => {
    // States
    const [title, setTitle] = useState<string>(plan?.title || "");
    const [description, setDescription] = useState<string>(plan?.description || "");
    const [isPublic, setIsPublic] = useState<boolean>(plan?.public || false);
    const [tags, setTags] = useState<string[]>(plan?.tags || []);
    const [tagInput, setTagInput] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>(plan?.color || "bg-blue-400");
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const [isStartDatePopoverOpen, setIsStartDatePopoverOpen] = useState<boolean>(false);
    const [isEndDatePopoverOpen, setIsEndDatePopoverOpen] = useState<boolean>(false);
    const [isColorPopoverOpen, setIsColorPopoverOpen] = useState<boolean>(false);

    // Available colors
    const availableColors = [
        ["bg-blue-400", "bg-red-400", "bg-green-400", "bg-yellow-400"],
        ["bg-indigo-400", "bg-pink-400", "bg-lime-400", "bg-orange-400"],
        ["bg-purple-400", "bg-teal-400", "bg-cyan-400", "bg-amber-400"],
    ];

    // User context
    const { userSmall } = useUserSmallDataContext();

    // Handles
    const addTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = () => {
        onCreate(
            startDate,
            endDate,
            title,
            description,
            isPublic,
            selectedUsers.map((user) => user.id),
            tags,
            selectedColor,
            plan?.id || 0
        );
        onClose();
    };

    return (
        <div
            style={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            className="bg-white shadow-lg border border-gray-300 rounded-lg py-4 px-6 w-[400px]"
        >
            {/* Title and Close button */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                <label htmlFor="FormTitle" className="block text-gray-700 text-lg font-bold">
                    {(useExistingPlan ? "Update" : "Create") + " Plan"}
                </label>
                <button className="dialog-close-button" onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} className="small-icon" />
                </button>
            </div>

            {/* Period selection */}
            <label htmlFor="Period" className="block text-gray-700 text-sm font-bold mb-2">
                Period
            </label>
            <div className="flex items-center mb-4 space-x-2">
                <Popover
                    button={{
                        label: "",
                        icon: faCalendar,
                    }}
                    buttonChildren={
                        <button
                            onClick={() => setIsStartDatePopoverOpen(!isStartDatePopoverOpen)}
                            className="flex items-center p-1"
                        >
                            <FontAwesomeIcon
                                icon={faCalendar}
                                className="small-icon text-gray-600 mr-1 mb-1"
                            />
                            {startDate ? (
                                format(startDate, "PPP")
                            ) : (
                                <span className="text-gray-600">Pick start date</span>
                            )}
                        </button>
                    }
                    isOpen={isStartDatePopoverOpen}
                    setIsOpen={setIsStartDatePopoverOpen}
                    className="rounded-md shadow-sm p-1 whitespace-nowrap"
                >
                    <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                            if (date) setStartDate(date);
                        }}
                        initialFocus
                        className="bg-white rounded-md"
                    />
                </Popover>
                <Popover
                    button={{
                        label: "",
                        icon: faCalendar,
                    }}
                    buttonChildren={
                        <button
                            onClick={() => setIsEndDatePopoverOpen(!isEndDatePopoverOpen)}
                            className="flex items-center"
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
                        </button>
                    }
                    isOpen={isEndDatePopoverOpen}
                    setIsOpen={setIsEndDatePopoverOpen}
                    className="rounded-md shadow-sm p-1 whitespace-nowrap"
                >
                    <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                            if (date) setEndDate(date);
                        }}
                        initialFocus
                        className="bg-white rounded-md"
                    />
                </Popover>
            </div>

            {/* Title */}
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                />
            </div>

            {/* Description */}
            <div className="mb-2">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                />
            </div>

            {/* Users and Public */}
            <label htmlFor="users" className="block text-gray-700 text-sm font-bold mr-2">
                Users
            </label>
            <UsersSelection
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                currentUser={userSmall.data[0]}
            />

            <label htmlFor="public" className="block text-gray-700 text-sm font-bold mr-2 mt-2">
                Visibility
            </label>
            <div className="flex items-center text-base mt-2 mb-4">
                <input
                    id="public"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="leading-tight p-1 mr-1"
                />
                <span>Public</span>
                <input
                    id="public"
                    type="checkbox"
                    checked={!isPublic}
                    onChange={(e) => setIsPublic(!e.target.checked)}
                    className="leading-tight ml-20 p-1 mr-1"
                />
                <span>Private</span>
            </div>

            <div className="flex items-start mb-4">
                {/* Tags */}
                <div className="">
                    <label htmlFor="tags" className="block text-gray-700 text-sm font-bold mb-2">
                        Tags
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            id="tags"
                            type="text"
                            placeholder="Add tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none shadow-sm w-40"
                        />
                        <button
                            onClick={addTag}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold whitespace-nowrap text-sm p-2 rounded-md border border-gray-200 focus:outline-none"
                        >
                            Add Tag
                        </button>
                    </div>
                    <div className="mt-2">
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="inline-block items-center max-w-10 truncate ... bg-gray-100 rounded-full p-2 text-sm font-semibold text-gray-800 mr-2 mt-2 border border-gray-200"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="px-1 ml-1 text-gray-700 hover:text-red-700"
                                >
                                    <FontAwesomeIcon icon={faXmark} className="w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Color */}
                <div className="ml-6">
                    <label htmlFor="color" className="block text-gray-700 text-sm font-bold mb-2">
                        Color
                    </label>

                    <Popover
                        button={{
                            label: "",
                            icon: faQuestion,
                        }}
                        buttonChildren={
                            <button
                                onClick={() => setIsColorPopoverOpen(!isColorPopoverOpen)}
                                className={`flex items-center w-7 h-7 pb-0.5 rounded-full shadow-sm border border-gray-400 ${selectedColor}`}
                            />
                        }
                        isOpen={isColorPopoverOpen}
                        setIsOpen={setIsColorPopoverOpen}
                        className="rounded-md shadow-md p-1 whitespace-nowrap"
                    >
                        <div className="flex flex-col gap-y-2 p-2">
                            {availableColors.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-start gap-x-2 ">
                                    {row.map((colorClass, colorIndex) => (
                                        <button
                                            key={colorIndex}
                                            className={`w-8 h-8 ${colorClass} rounded-full border border-gray-400`}
                                            onClick={() => {
                                                setSelectedColor(colorClass);
                                                setIsColorPopoverOpen(false);
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Popover>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button className="standard-write-button" type="button" onClick={handleSubmit}>
                    {(useExistingPlan ? "Update" : "Create") + " Plan"}
                </button>
                {useExistingPlan && onDelete && plan && (
                    <button
                        className="bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded focus:outline-none"
                        type="button"
                        onClick={() => onDelete(plan.id)}
                    >
                        {"Delete"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PlanCreationDialog;
