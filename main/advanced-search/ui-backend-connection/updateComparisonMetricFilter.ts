import { ComparisonFilter } from "@/types/utilsTypes";
import { cleanComparisonFilters } from "./updateDateFilter";

// Function to update the metric filter
export const applyMetricFilter = (
    biggerThanFilterOn: boolean,
    metricValue: number,
    biggerThanMetricValue: boolean,
    selectedMetric: string,
    comparisonFilters: Record<string, ComparisonFilter[]> | undefined,
    setComparisonFilters: React.Dispatch<
        React.SetStateAction<Record<string, ComparisonFilter[]> | undefined>
    >
) => {
    if (biggerThanFilterOn) {
        let metricFilter: ComparisonFilter[] = [];

        if (metricValue) {
            metricFilter = [
                {
                    greaterThan: biggerThanMetricValue,
                    value: metricValue,
                    filterType: "metric",
                },
            ];
        }

        const existingFilters = comparisonFilters?.[selectedMetric] ?? [];
        const cleanedFilters = cleanComparisonFilters(
            existingFilters,
            "metric"
        );
        const newComparisonFilters = [...cleanedFilters, ...metricFilter];
        setComparisonFilters({
            ...comparisonFilters,
            [selectedMetric]: newComparisonFilters,
        });
    } else {
        // Remove the metric filter when unticked
        if (comparisonFilters) {
            const { [selectedMetric]: _, ...remainingFilters } =
                comparisonFilters;
            setComparisonFilters(remainingFilters);
        }
    }
};

export const clearMetricFiltersOnOptionChange = (
    biggerThanFilterOn: boolean,
    comparisonFilters: Record<string, ComparisonFilter[]> | undefined,
    setComparisonFilters: React.Dispatch<
        React.SetStateAction<Record<string, ComparisonFilter[]> | undefined>
    >,
    setMetricValue: React.Dispatch<React.SetStateAction<number>>
) => {
    const newComparisonFilters = { ...comparisonFilters };

    // Remove all filters related to the old selectedMetric
    Object.keys(newComparisonFilters).forEach((key) => {
        newComparisonFilters[key] = cleanComparisonFilters(
            newComparisonFilters[key] || [],
            "metric"
        );

        if (newComparisonFilters[key].length === 0) {
            delete newComparisonFilters[key];
        }
    });

    setComparisonFilters(newComparisonFilters);

    // Clear metric
    setMetricValue(0);
};
