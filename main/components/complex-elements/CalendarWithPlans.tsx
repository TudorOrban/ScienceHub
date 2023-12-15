import { HookResult } from "@/hooks/fetch/useGeneralData";
import { Plan } from "@/types/utilsTypes";
import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { formatISO } from "date-fns";
import debounce from "lodash.debounce";
import { useCreateGeneralData } from "@/hooks/create/useCreateGeneralData";
import { useCreateGeneralManyToManyEntry } from "@/hooks/create/useCreateGeneralManyToManyEntry";
import { useUpdateGeneralData } from "@/hooks/update/useUpdateGeneralData";
import { useDeleteGeneralData } from "@/hooks/delete/useDeleteGeneralData";
const PlanCreationDialog = dynamic(() => import("./PlanCreationDialog"));

interface CustomCalendarProps {
    plansData: HookResult<Plan>;
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    tempPlanOverlay: JSX.Element[] | null;
    setTempPlanOverlay: (planOverlay: JSX.Element[] | null) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
    plansData,
    currentMonth,
    setCurrentMonth,
    tempPlanOverlay,
    setTempPlanOverlay,
}) => {
    // States
    // - Calendar
    const calendarRef = useRef<HTMLDivElement>(null);
    const [calendarWidth, setCalendarWidth] = useState(0);
    const [calendarGrid, setCalendarGrid] = useState<(Date | null)[]>([]);
    const [calendarHeight, setCalendarHeight] = useState(0);
    const [useExistingPlan, setUseExistingPlan] = useState<boolean>(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan>();

    // - Adding plans
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Date | null>(null);
    const [dragEnd, setDragEnd] = useState<Date | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogPosition, setDialogPosition] = useState<{
        top: number;
        left: number;
    }>({ top: 0, left: 0 });
    const [isPlanSaved, setIsPlanSaved] = useState(false);

    // Constants
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDate = new Date();

    // - For  displaying
    const cellWidth = calendarWidth / 7;
    const cellHeight = 120;
    const laneHeight = 20;
    const maxLanes = 3;
    const numberOfRows = Math.ceil(calendarGrid.length / 7);
    const laneSpacing = 8;

    // Update width on window resize
    const updateWidth = () => {
        if (calendarRef.current) {
            setCalendarWidth(calendarRef.current.getBoundingClientRect().width);
        }
    };

    const debouncedUpdateWidth = debounce(updateWidth, 1000);

    useEffect(() => {
        updateWidth();
        window.addEventListener("resize", debouncedUpdateWidth);

        return () => {
            window.removeEventListener("resize", debouncedUpdateWidth);
        };
    }, []);

    // Calculate the calendar height based on the number of weeks and the cell height
    useEffect(() => {
        const newCalendarHeight =
            Math.ceil(calendarGrid.length / 7) * cellHeight;
        setCalendarHeight(newCalendarHeight);
    }, [calendarGrid]);

    // Generate grid
    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        setCalendarGrid(generateCalendarGrid(year, month));
    }, [currentMonth]);

    // Compute lane assigment for plans
    const assignLanesToPlans = (plans: Plan[]) => {
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
            plan.lane = assignedLane + 1;
            lanes[assignedLane] = planEnd;
        });

        return plans;
    };

    // Filter plans by current month and assign lanes
    const windowPlans = useMemo(() => {
        return assignLanesToPlans(
            plansData.data.filter(
                (plan) =>
                    new Date(plan.startingAtDate).getMonth() ===
                        currentMonth.getMonth() ||
                    new Date(plan.endingAtDate).getMonth() ===
                        currentMonth.getMonth()
            )
        );
    }, [plansData.data, currentMonth]);

    // Updated createPlanOverlays function
    const createPlanOverlays = (
        plan: Plan,
        firstDayOfGrid: Date
    ): JSX.Element[] => {
        const overlays: JSX.Element[] = [];
        let currentDate = new Date(plan.startingAtDate);
        let planEndDate = new Date(plan.endingAtDate);

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
            const overlayLeft = currentDate.getDay() * cellWidth;
            const daysInSegment =
                getDayDifference(currentDate, segmentEndDate) + 1;
            const overlayWidth = daysInSegment * cellWidth;
            const weekRow = getWeekNumber(
                currentDate,
                firstDayOfGrid,
                currentMonth.getMonth()
            );
            currentDate = new Date(segmentEndDate.getTime() + 86400000);

            const lane = plan.lane || 1;
            // Subtract the calendar grid's top position from the overlayTop calculation
            const overlayTop =
                weekRow * cellHeight +
                (lane - 1) * (laneHeight + laneSpacing) -
                570;

            if (lane <= 3) {
                overlays.push(
                    <button
                        key={`${plan.id}-${currentDate}`}
                        className={`absolute border border-gray-600 rounded-md px-1 ${
                            plan.color || "bg-blue-400"
                        } hover:${plan.color?.slice(0, -3) || "bg-blue-"}600`}
                        style={{
                            left: `${overlayLeft}px`,
                            top: `${overlayTop}px`,
                            width: `${overlayWidth}px`,
                            height: `${laneHeight}px`,
                        }}
                        onClick={() => {
                            setUseExistingPlan(true);
                            setSelectedPlan(plan);
                            setShowDialog(true);
                        }}
                    >
                        <span className="flex items-center no-select text-white text-xs">
                            {plan.title}
                        </span>
                    </button>
                );
            }

            // Move to the next day after the end of this segment
            currentDate = new Date(segmentEndDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return overlays;
    };

    const firstDayOfGrid =
        calendarGrid[0] ||
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

    // Plan creation - dragging + dialog
    const createTempPlanOverlay = (
        start: Date,
        end: Date,
        firstDayOfGrid: Date
    ): JSX.Element[] => {
        const overlays: JSX.Element[] = [];
        let currentDate = new Date(start);

        while (currentDate <= end) {
            // Find the end of the week or the end date of the dragging range, whichever is sooner
            let endOfWeek = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + (6 - currentDate.getDay())
            );
            let segmentEndDate = new Date(
                Math.min(end.getTime(), endOfWeek.getTime())
            );

            let overlayLeft = (currentDate.getDay() % 7) * cellWidth;
            let daysInSegment =
                getDayDifference(currentDate, segmentEndDate) + 1;
            const overlayWidth = daysInSegment * cellWidth;

            // Determine the row of the week in the calendar
            let weekRow = getWeekNumber(
                currentDate,
                firstDayOfGrid,
                currentMonth.getMonth()
            );
            if (
                currentDate.getDay() >= 5 &&
                currentDate.getTime() === start.getTime()
            ) {
                // Special handling for start dates that are Friday or Saturday
                // To be redone in the future
                weekRow--;
            }

            // Calculate the top position of the overlay
            const overlayTop = weekRow * cellHeight - 570;

            overlays.push(
                <div
                    key={`temp-${currentDate}`}
                    className="absolute border border-gray-600 rounded-md px-1 bg-green-400"
                    style={{
                        left: `${overlayLeft}px`,
                        top: `${overlayTop}px`,
                        width: `${overlayWidth}px`,
                        height: `${laneHeight}px`,
                    }}
                >
                    <span className="flex items-center text-white text-xs">
                        New Plan
                    </span>
                </div>
            );

            // Move to the next day after the end of the current segment
            currentDate = new Date(segmentEndDate.getTime() + 86400000);
        }

        return overlays;
    };

    // - Handle mouse down on a cell
    const handleMouseDown = (date: Date) => {
        setIsDragging(true);
        setDragStart(date);
        setDragEnd(date);
    };

    // - Handle mouse move on a cell
    const handleMouseMove = (date: Date) => {
        if (isDragging && dragStart) {
            setDragEnd(date);
            const newTempPlanOverlay = createTempPlanOverlay(
                dragStart,
                date,
                firstDayOfGrid
            );
            setTempPlanOverlay(newTempPlanOverlay);
        }
    };

    useEffect(() => {
        const handleMouseUpGlobal = () => {
            if (isDragging) {
                setIsDragging(false);
                setShowDialog(true);
                setDialogPosition({ top: 200, left: 200 });
            }
        };

        if (isDragging) {
            document.addEventListener("mouseup", handleMouseUpGlobal);
        }

        return () => {
            document.removeEventListener("mouseup", handleMouseUpGlobal);
        };
    }, [isDragging]);

    // Plan to be created
    let tempPlan: Plan | null = null;
    if (dragStart && dragEnd) {
        tempPlan = {
            id: 0,
            title: "New Plan",
            description: "",
            tags: [],
            public: false,
            startingAtDate: formatISO(dragStart),
            endingAtDate: formatISO(dragEnd),
            color: "bg-green-400",
        };
    }

    const handleCloseDialog = () => {
        if (!isPlanSaved) {
            setDragStart(null);
            setDragEnd(null);
        }
        if (useExistingPlan) {
            setUseExistingPlan(false);
            setSelectedPlan(undefined);
        }
        setShowDialog(false);
        setTempPlanOverlay(null);
        setIsPlanSaved(false);
    };

    // Save plan / Update plan / Delete plan
    // TODO: Proper form validation, error handling etc
    const createPlan = useCreateGeneralData();
    const createPlanUsers = useCreateGeneralManyToManyEntry();
    const updatePlan = useUpdateGeneralData();

    const handleCreateOrUpdatePlan = async (
        startDate: Date,
        endDate: Date,
        title: string,
        description: string,
        isPublic: boolean,
        users: string[],
        tags: string[],
        color: string,
        planId?: number
    ) => {
        try {
            const planData = {
                starting_at_date: startDate,
                ending_at_date: endDate,
                title: title,
                description: description,
                public: isPublic,
                tags: tags,
                color: color,
            };

            if (useExistingPlan && planId) {
                const updatedPlan = await updatePlan.mutateAsync({
                    tableName: "plans",
                    identifierField: "id",
                    identifier: planId,
                    updateFields: { ...planData },
                });
            } else {
                const newPlan = await createPlan.mutateAsync({
                    tableName: "plans",
                    input: {
                        ...planData,
                    },
                });

                if ((newPlan as any).id) {
                    for (const userId of users) {
                        const newPlanUser = await createPlanUsers.mutateAsync({
                            tableName: "plan_users",
                            firstEntityColumnName: "plan_id",
                            firstEntityId: (newPlan as any).id,
                            secondEntityColumnName: `user_id`,
                            secondEntityId: userId,
                        });
                    }
                }
            }
        } catch (error) {
            console.log("An error occurred: ", error);
        }

        setIsPlanSaved(true);
        plansData.refetch?.();
        setShowDialog(false);
    };

    const deletePlan = useDeleteGeneralData();

    const handleDeletePlan = async (planId: number) => {
        try {
            const deletedPlan = await deletePlan.mutateAsync({
                tableName: "plans",
                id: planId,
            });
        } catch (error) {
            console.log("An error occurred: ", error);
        }
        plansData.refetch?.();
        setShowDialog(false);
    };

    // Day Cell Element, with dragging functionality
    const renderDayCell = (date: Date | null, index: number): JSX.Element => {
        return (
            <div
                key={index}
                onMouseDown={() => handleMouseDown(date || new Date(0))}
                onMouseMove={() => handleMouseMove(date || new Date(0))}
                className={`flex flex-col items-center border-r border-b border-gray-300 text-center no-select font-semibold ${
                    date?.getMonth() === currentMonth.getMonth()
                        ? "text-gray-700"
                        : "text-gray-400"
                } ${isSameDay(date, currentDate) ? "text-blue-500" : ""}`}
                style={{ height: cellHeight + "px" }}
            >
                {date?.getDate()}
            </div>
        );
    };

    return (
        <div className="relative w-full overflow-x-hidden p-4">
            {/* Grid */}
            <div
                key={`calendar-grid-${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
                ref={calendarRef}
                className="mx-auto w-full max-w-screen-lg border border-gray-300 rounded-lg shadow-sm"
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

            {/* Plans Overlay */}
            <div
                className="relative w-full max-w-screen-lg mx-auto"
                style={{ height: `${calendarHeight}px` }}
            >
                {windowPlans.map((plan) =>
                    createPlanOverlays(plan, firstDayOfGrid)
                )}
                {tempPlanOverlay}
            </div>
            {showDialog && (
                <PlanCreationDialog
                    useExistingPlan={useExistingPlan}
                    plan={selectedPlan}
                    startDate={
                        useExistingPlan
                            ? new Date(selectedPlan?.startingAtDate || "")
                            : dragStart || new Date(0)
                    }
                    endDate={
                        useExistingPlan
                            ? new Date(selectedPlan?.endingAtDate || "")
                            : dragEnd || new Date(0)
                    }
                    setStartDate={setDragStart}
                    setEndDate={setDragEnd}
                    onClose={handleCloseDialog}
                    onCreate={handleCreateOrUpdatePlan}
                    onDelete={handleDeletePlan}
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

// Grid generation
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

// Utils
const isSameDay = (a: Date | null, b: Date | null): boolean => {
    if (!a || !b) return false;
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
};

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

const getWeekNumber = (
    date: Date,
    firstDayOfGrid: Date,
    currentMonth: number
): number => {
    const startDayOffset = firstDayOfGrid.getDay();
    let dateOffset = date.getDate() - 1;

    // If the date is from the previous month or the next month, adjust the offset accordingly
    if (date.getMonth() < currentMonth) {
        // If date is from the previous month, count the offset from the end of the previous month
        dateOffset -= getTotalDaysInMonth(date.getFullYear(), date.getMonth());
    } else if (date.getMonth() > currentMonth) {
        // If date is from the next month, reset the offset
        dateOffset = date.getDate() - 1;
    }

    return Math.floor((startDayOffset + dateOffset) / 7);
};
