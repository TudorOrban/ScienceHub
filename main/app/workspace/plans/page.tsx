"use client";

import { usePlansSearch } from "@/hooks/fetch/search-hooks/usePlans";
import CustomCalendar from "@/components/complex-elements/plans/CalendarWithPlans";
import PlansList from "@/components/complex-elements/plans/PlansList";
import Select, {
    SelectOption,
} from "@/components/light-simple-elements/Select";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import WorkspaceNoUserFallback from "@/components/fallback/WorkspaceNoUserFallback";
import WorkspaceOverviewHeader from "@/components/headers/WorkspaceOverviewHeader";
import { useUserSmallDataContext } from "@/contexts/current-user/UserSmallData";

export default function PlansPage() {
    // States
    const [currentSelection, setCurrentSelection] = useState<SelectOption>({
        label: "Calendar", value: "calendar"
    });
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [tempPlanOverlay, setTempPlanOverlay] = useState<
        JSX.Element[] | null
    >(null);

    // Contexts
    const { userSmall } = useUserSmallDataContext();
    const currentUserId = userSmall.data?.[0]?.id;

    // Custom hooks
    const userPlansData = usePlansSearch({
        extraFilters: {
            users: currentUserId,
        },
        enabled: !!currentUserId,
        context: "Workspace General",
        page: 1,
        itemsPerPage: 100,
        includeRefetch: true,
    });

    // Sort plans by starting date
    userPlansData.data?.sort(
        (a, b) =>
            new Date(a.startingAtDate).getTime() -
            new Date(b.startingAtDate).getTime()
    );

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
        setTempPlanOverlay(null);
    };

    const goToNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
        setTempPlanOverlay(null);
    };

    if (!currentUserId) {
        return (
            <WorkspaceNoUserFallback />
        )
    }
    
    return (
        <div>
            <WorkspaceOverviewHeader
                startingActiveTab="Plans"
                currentUser={userSmall.data?.[0]}
            />
            {/* Control Panel */}
            <div className="flex items-center p-4 border-b border-gray-300 shadow-sm">
                <div className="flex items-center px-4">
                    <button onClick={goToPreviousMonth}>
                        <FontAwesomeIcon
                            icon={faCaretLeft}
                            className="small-icon text-gray-700"
                        />
                    </button>
                    <span className="w-32 flex justify-center items-center whitespace-nowrap">
                        {currentMonth.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <button onClick={goToNextMonth}>
                        <FontAwesomeIcon
                            icon={faCaretRight}
                            className="small-icon text-gray-700"
                        />
                    </button>
                </div>
                <Select
                    selectOptions={[{ label: "Calendar", value: "calendar" }, { label: "List", value: "list" }]}
                    currentSelection={currentSelection}
                    setCurrentSelection={setCurrentSelection}
                    className="w-32 z-50"
                />
            </div>
            {currentSelection.label === "Calendar" && (
                <CustomCalendar
                    plansData={userPlansData}
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    tempPlanOverlay={tempPlanOverlay}
                    setTempPlanOverlay={setTempPlanOverlay}
                />
            )}
            {currentSelection.label === "List" && (
                <PlansList plansData={userPlansData}/>
            )}
        </div>
    );
}
