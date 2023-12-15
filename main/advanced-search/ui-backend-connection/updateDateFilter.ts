import { ComparisonFilter } from "@/types/utilsTypes";
import { formatDateForTimestamptz } from "@/utils/functions";

// Apply date filter
export const applyDateFilter = (
    dateFilterOn: boolean,
    startDate: Date | undefined,
    endDate: Date | undefined,
    selectedDateOption: string,
    comparisonFilters: Record<string, ComparisonFilter[]> | undefined,
    setComparisonFilters: React.Dispatch<
        React.SetStateAction<Record<string, ComparisonFilter[]> | undefined>
    >
) => {
    if (dateFilterOn) {
        let startDateFilter: ComparisonFilter[] = [];
        let endDateFilter: ComparisonFilter[] = [];

        if (startDate) {
            startDateFilter = [
                {
                    greaterThan: true,
                    value: formatDateForTimestamptz(startDate),
                    filterType: "date",
                },
            ];
        }
        if (endDate) {
            endDateFilter = [
                {
                    greaterThan: false,
                    value: formatDateForTimestamptz(endDate),
                    filterType: "date",
                },
            ];
        }

        const existingFilters = comparisonFilters?.[selectedDateOption] ?? [];
        const cleanedFilters = cleanComparisonFilters(existingFilters, "date");
        const newComparisonFilters = [
            ...cleanedFilters,
            ...startDateFilter,
            ...endDateFilter,
        ];

        setComparisonFilters({
            ...comparisonFilters,
            [selectedDateOption]: newComparisonFilters,
        });
    } else {
        if (comparisonFilters) {
            const { [selectedDateOption]: _, ...remainingFilters } =
                comparisonFilters;
            setComparisonFilters(remainingFilters);
        }
    }
};

// Clear comparison filters of prescribed type
export const cleanComparisonFilters = (
    existingFilters: ComparisonFilter[],
    type: string
) => {
    return existingFilters.filter((filter) => filter.filterType !== type);
};

// Clear date filters when selectedDateOption changes
export const clearDateFiltersOnOptionChange = (
    dateFilterOn: boolean,
    comparisonFilters: Record<string, ComparisonFilter[]> | undefined,
    setComparisonFilters: React.Dispatch<React.SetStateAction<Record<string, ComparisonFilter[]> | undefined>>,
    setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>,
    setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  ) => {

    const newComparisonFilters = { ...comparisonFilters };
    let filtersUpdated = false;
  
    Object.keys(newComparisonFilters).forEach((key) => {
      newComparisonFilters[key] = cleanComparisonFilters(newComparisonFilters[key] || [], "date");
  
      if (newComparisonFilters[key].length === 0) {
        delete newComparisonFilters[key];
        filtersUpdated = true;
      }
    });
  
    if (filtersUpdated) {
      setComparisonFilters(newComparisonFilters);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };
  
