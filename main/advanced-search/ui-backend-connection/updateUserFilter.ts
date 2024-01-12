import { User } from "@/types/userTypes";

// Helper function for user filter logic
export const updateUserFilter = (
    userFilterOn: boolean,
    users: User[],
    filters: Record<string, any>,
    setFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>
) => {
    if (userFilterOn) {
        // Get existing user filters
        const filterUsers: string[] = filters.hasOwnProperty("users")
            ? filters.users
            : [];
        const usersIds = users.map((user) => user.id);

        // Check if the users list is empty or the filters need updating
        if (users.length === 0 || JSON.stringify(filterUsers) !== JSON.stringify(usersIds)) {
            const newFilters = users.length === 0 
                ? {...filters} 
                : {...filters, users: usersIds};

            // Remove the key if there are no users
            if (users.length === 0) {
                delete newFilters.users;
            }

            setFilters(newFilters);
        }
    } else {
        // Clear user filter by removing the key
        const { users: removedUsers, ...newFilters } = filters;
        setFilters(newFilters);
    }
};