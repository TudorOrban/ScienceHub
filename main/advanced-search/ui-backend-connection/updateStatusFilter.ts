// Helper function for status filter logic
export const updateStatusFilter = (
    statusFilterOn: boolean,
    status: string,
    filters: Record<string, any>,
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
    if (statusFilterOn) {
        if (status && !filters.hasOwnProperty("status")) {
            const newFilters: Record<string, any> = {
                ...filters,
                status: status,
            };

            setFilters(newFilters);
        }
    } else {
        const { status, ...newFilters } = filters;
        setFilters(newFilters);
    }
};
