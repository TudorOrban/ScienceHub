import { HookResult } from "@/app/hooks/fetch/useGeneralData";
import { Plan } from "@/types/utilsTypes";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { formatISO } from "date-fns";
const PlanCreationDialog = dynamic(() => import("./PlanCreationDialog"));

interface CustomCalendarProps {
    plansData: HookResult<Plan>;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ plansData }) => {
    const calendarRef = useRef<HTMLDivElement>(null); // Create a ref for the calendar
    const [calendarWidth, setCalendarWidth] = useState(0); // State to store the calendar's width
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendarGrid, setCalendarGrid] = useState<(Date | null)[]>([]);
    const [calendarHeight, setCalendarHeight] = useState(0);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Date | null>(null);
    const [dragEnd, setDragEnd] = useState<Date | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogPosition, setDialogPosition] = useState<{
        top: number;
        left: number;
    }>({ top: 0, left: 0 });

    const updateWidth = () => {
        if (calendarRef.current) {
            setCalendarWidth(calendarRef.current.getBoundingClientRect().width);
        }
    };

    useEffect(() => {
        updateWidth();
        window.addEventListener("resize", updateWidth); // Update width on window resize

        return () => {
            window.removeEventListener("resize", updateWidth); // Cleanup the event listener
        };
    }, []);

    const cellWidth = calendarWidth / 7;
    const cellHeight = 120;
    const laneHeight = 20;
    const numberOfRows = Math.ceil(calendarGrid.length / 7);
    const laneSpacing = 8;
    // const calendarHeight = numberOfRows * 20; // Assuming each row is 20px high

    useEffect(() => {
        // Calculate the calendar height based on the number of weeks and the cell height
        const newCalendarHeight =
            Math.ceil(calendarGrid.length / 7) * cellHeight;
        setCalendarHeight(newCalendarHeight); // Assume setCalendarHeight is a state setter function for calendarHeight
    }, [calendarGrid]);

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        setCalendarGrid(generateCalendarGrid(year, month));
    }, [currentMonth]);

    const assignLanesToPlans = (plans: Plan[]) => {
        // Sort plans by their starting date
        plans.sort(
            (a, b) =>
                new Date(a.startingAtDate).getTime() -
                new Date(b.startingAtDate).getTime()
        );

        // Initialize an array to keep track of the last ending date in each lane
        let lanes: number[] = [];

        plans.forEach((plan) => {
            const planStart = new Date(plan.startingAtDate).getTime();
            const planEnd = new Date(plan.endingAtDate).getTime();

            // Find the first lane where the plan doesn't overlap
            let assignedLane = lanes.findIndex(
                (lastEnd) => planStart > lastEnd
            );
            if (assignedLane === -1) {
                // No non-overlapping lane found, add a new lane
                assignedLane = lanes.length;
            }

            // Assign the lane to the plan and update the last end date in the lane
            plan.lane = assignedLane + 1; // +1 to make lane numbers start from 1
            lanes[assignedLane] = planEnd;
        });

        return plans;
    };

    let windowPlans = assignLanesToPlans(
        plansData.data.filter(
            (plan) =>
                new Date(plan.startingAtDate).getMonth() ===
                    currentMonth.getMonth() ||
                new Date(plan.endingAtDate).getMonth() ===
                    currentMonth.getMonth()
        )
    );

    // Adjust the getDayDifference function to handle dates only (removing time component)
    const getDayDifference = (date1: Date, date2: Date): number => {
        const date1StartOfDay = new Date(
            date1.getFullYear(),
            date1.getMonth(),
            date1.getDate()
        );
        const date2StartOfDay = new Date(
            date2.getFullYear(),
            date2.getMonth(),
            date2.getDate()
        );
        return Math.round(
            (date2StartOfDay.getTime() - date1StartOfDay.getTime()) /
                (1000 * 60 * 60 * 24)
        );
    };

    // Inside your component
    const getWeekNumber = (date: Date, firstDayOfGrid: Date): number => {
        const startDayOffset = firstDayOfGrid.getDay();
        const dateOffset = date.getDate() - 1; // Zero-based offset in the month
        return Math.floor((startDayOffset + dateOffset) / 7);
    };

    // Updated createPlanOverlays function
    const createPlanOverlays = (
        plan: Plan,
        firstDayOfGrid: Date
    ): JSX.Element[] => {
        const overlays: JSX.Element[] = [];
        let currentDate = new Date(plan.startingAtDate);
        let planEndDate = new Date(plan.endingAtDate);

        // const calendarTop = calendarRef.current?.getBoundingClientRect().top ?? 0;

        while (currentDate <= planEndDate) {
            // Get the end of the current week or the plan end date, whichever is sooner
            let endOfWeek = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + (6 - currentDate.getDay())
            );
            let segmentEndDate = new Date(
                Math.min(planEndDate.getTime(), endOfWeek.getTime())
            );

            // Calculate the overlayLeft based on the current date's day of the week
            const dayIndex = currentDate.getDay();
            const overlayLeft = dayIndex * cellWidth;

            // Calculate the overlayWidth based on the number of days from currentDate to segmentEndDate
            const daysInSegment =
                getDayDifference(currentDate, segmentEndDate) + 1;
            const overlayWidth = daysInSegment * cellWidth;

            const weekRow = getWeekNumber(currentDate, firstDayOfGrid);
            const lane = plan.lane || 1;
            // Subtract the calendar grid's top position from the overlayTop calculation
            const overlayTop =
                weekRow * cellHeight +
                (lane - 1) * (laneHeight + laneSpacing) -
                570;

            overlays.push(
                <div
                    key={`${plan.id}-${currentDate}`}
                    className={`absolute border border-gray-600 rounded-md px-1 ${
                        plan.color ? plan.color : "bg-blue-400"
                    }`}
                    style={{
                        left: `${overlayLeft}px`,
                        top: `${overlayTop}px`,
                        width: `${overlayWidth}px`,
                        height: `${laneHeight}px`,
                    }}
                >
                    <span className="flex items-center text-white text-xs">
                        {plan.title}
                    </span>
                </div>
            );

            // Move to the next day after the end of this segment
            currentDate = new Date(segmentEndDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return overlays;
    };

    useLayoutEffect(() => {
        if (calendarRef.current) {
            const { top, width } = calendarRef.current.getBoundingClientRect();
            setCalendarWidth(width);
        }
    }, [currentMonth]);

    const firstDayOfGrid =
        calendarGrid[0] ||
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    // Handle mouse down on a cell
    const handleMouseDown = (date: Date) => {
        setIsDragging(true);
        setDragStart(date);
        setDragEnd(date); // Initially, dragStart and dragEnd are the same
    };

    // Handle mouse move on a cell
    const handleMouseMove = (date: Date) => {
        if (isDragging) {
            setDragEnd(date);
        }
    };

    // Handle mouse up on a cell
    // Handle mouse up on a cell
    const handleMouseUp = (mouseUpEvent: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            setIsDragging(false);
            setShowDialog(true); // Show dialog to enter new plan details

            const target = mouseUpEvent.currentTarget as HTMLDivElement;
            const boundingRect = target.getBoundingClientRect();

            // Center the dialog horizontally
            const dialogWidth = 200; // Fixed width of the dialog
            const leftPos = (window.innerWidth - dialogWidth) / 2;

            // Position the dialog a bit below the end date cell
            const topPos = boundingRect.bottom + 10; // 10px below the cell for visibility

            setDialogPosition({
                top: topPos,
                left: leftPos,
            });
        }
    };

    let tempPlan: Plan | null = null;
    if (dragStart && dragEnd) {
        tempPlan = {
            id: "temp", // Temporary ID
            title: "New Plan", // Temporary title
            description: "", // Default description
            tags: [], // Default tags
            public: false, // Default public status
            startingAtDate: formatISO(dragStart),
            endingAtDate: formatISO(dragEnd),
            color: "bg-green-400", // Temporary color
            // Other fields can be added as needed
        };
    }

    // Combine windowPlans with the temporary plan if it exists
    let combinedPlans = tempPlan ? [...windowPlans, tempPlan] : windowPlans;

    const [isPlanSaved, setIsPlanSaved] = useState(false);

    const handleCloseDialog = () => {
        if (!isPlanSaved) {
            setDragStart(null); // Clear the start date of the temporary plan
            setDragEnd(null); // Clear the end date of the temporary plan
        }
        setShowDialog(false); // Close the dialog
        setIsPlanSaved(false); // Reset the saved state
    };

    const handleSavePlan = () => {
        setIsPlanSaved(true);
        // Implement the logic to save the plan
        // After saving, the plan should be added to your plansData or similar state
        setShowDialog(false);
    };

    const renderDayCell = (date: Date | null, index: number) => {
        return (
            <div
                key={index}
                onMouseDown={() => handleMouseDown(date || new Date(0))}
                onMouseMove={() => handleMouseMove(date || new Date(0))}
                onMouseUp={handleMouseUp}
                className={`flex flex-col items-center border-r border-b border-gray-300 text-center no-select ${
                    date?.getMonth() === currentMonth.getMonth()
                        ? "text-gray-700"
                        : "text-gray-400"
                }`}
                style={{ height: cellHeight + "px" }}
            >
                {date?.getDate()}
            </div>
        );
    };

    return (
        <div className="relative w-full overflow-x-hidden">
            {/* Calendar Header and Grid Rendering */}
            <div className="flex flex-col items-center justify-center w-full shadow-sm">
                <div className="flex justify-between w-full max-w-screen-lg px-4">
                    <button onClick={goToPreviousMonth}>Previous</button>
                    {currentMonth.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                    <button onClick={goToNextMonth}>Next</button>
                </div>
                <div
                    key={`calendar-grid-${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
                    ref={calendarRef}
                    className="border border-gray-300 rounded-lg w-full max-w-screen-lg mx-auto"
                >
                    <div className="grid grid-cols-7">
                        {daysOfWeek.map((day) => (
                            <div
                                key={day}
                                className="py-2 border-b border-gray-300 text-center text-gray-800"
                            >
                                {day}
                            </div>
                        ))}
                        {calendarGrid.map((date, index) =>
                            renderDayCell(date, index)
                        )}
                    </div>
                </div>
            </div>

            {/* Plans Overlay */}
            <div
                className="relative w-full max-w-screen-lg mx-auto"
                style={{ height: `${calendarHeight}px` }}
            >
                {combinedPlans.map((plan) =>
                    createPlanOverlays(plan, firstDayOfGrid)
                )}
            </div>
            {showDialog && (
                <PlanCreationDialog
                    startDate={dragStart || new Date(0)}
                    endDate={dragEnd || new Date(0)}
                    setStartDate={setDragStart}
                    setEndDate={setDragEnd}
                    onClose={handleCloseDialog}
                    onSave={handleSavePlan}
                    position={dialogPosition}
                />
            )}
        </div>
    );
};

export default CustomCalendar;

const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

const getTotalDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const generateCalendarGrid = (year: number, month: number): (Date | null)[] => {
    const totalDays = getTotalDaysInMonth(year, month);

    const daysArray: (Date | null)[] = [];

    // Add days from the previous month
    const daysInPrevMonth = getFirstDayOfMonth(year, month);
    const prevMonth = new Date(year, month - 1, 1);
    for (let i = 0; i < daysInPrevMonth; i++) {
        daysArray.push(
            new Date(
                year,
                month - 1,
                getTotalDaysInMonth(
                    prevMonth.getFullYear(),
                    prevMonth.getMonth()
                ) - i
            )
        );
    }

    // Reverse the order of the previous month's days
    daysArray.reverse();

    // Add days of the current month
    for (let day = 1; day <= totalDays; day++) {
        daysArray.push(new Date(year, month, day));
    }

    // Add days from the next month
    let totalCellsNeeded = daysArray.length > 35 ? 42 : 35; // Adjust for 5 or 6 rows x 7 columns
    for (let i = daysArray.length; i < totalCellsNeeded; i++) {
        daysArray.push(
            new Date(year, month + 1, i - totalDays - daysInPrevMonth + 1)
        );
    }

    return daysArray;
};
