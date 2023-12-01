import { User } from "@/types/userTypes";

// Helper function for user filter logic
export const updateUserFilter = (
    userFilterOn: boolean,
    users: User[],
    filters: Record<string, any>,
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
    if (userFilterOn && users.length > 0) {
        const filterUsers: string[] = filters.hasOwnProperty("users")
            ? filters.users
            : [];
        const usersIds = users.map((user) => user.id);

        if (filterUsers && usersIds && filterUsers !== usersIds) {
            const newFilters: Record<string, string[]> = {
                ...filters,
                users: usersIds,
            };

            setFilters(newFilters);
        }
    } else {
        const { users, ...newFilters } = filters;
        setFilters(newFilters);
    }
};
