import { useUserId } from "@/contexts/current-user/UserIdContext";
import { useUsersSearch } from "@/hooks/fetch/search-hooks/community/useUsersSearch";
import { User } from "@/types/userTypes";
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Noop, RefCallBack } from "react-hook-form";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import SearchInput from "../../complex-elements/SearchInput";
import { useUsersSelectionContext } from "@/contexts/selections/UsersSelectionContext";
import SmallUserCard from "@/components/elements/SmallUserCard";

type RestFieldProps = {
    onChange: (...event: any[]) => void;
    onBlur: Noop;
    name: string;
    ref: RefCallBack;
};

type UsersSelectionProps = {
    restFieldProps: RestFieldProps;
    createNewOn?: boolean;
};

const UsersSelection: React.FC<UsersSelectionProps> = ({ restFieldProps, createNewOn }) => {
    // State for holding selected users' info (id username fullName)
    const [selectedUsersSmall, setSelectedUsersSmall] = useState<User[]>([]);

    // Contexts
    // - Current user
    const { selectedUsersIds, setSelectedUsersIds } = useUsersSelectionContext();

    // - User selection
    const currentUserId = useUserId();

    // Hooks
    // - All users, TBM later
    const usersData = useUsersSearch({
        extraFilters: {},
        enabled: true,
        context: "Reusable",
    });

    // Effects
    const hasAddedCurrentUser = useRef(false);

    // Add current user to selection (both context ids and User[] state)
    useEffect(() => {
        if (
            !hasAddedCurrentUser.current &&
            !!currentUserId &&
            !selectedUsersIds.includes(currentUserId) &&
            usersData.data &&
            usersData.data.length > 0
        ) {
            setSelectedUsersIds((prevSelectedUsersIds) => [...prevSelectedUsersIds, currentUserId]);
            const currentUserSmall = usersData?.data.filter((user) => user.id === currentUserId)[0];
            setSelectedUsersSmall((prevUsersSmall) => [...prevUsersSmall, currentUserSmall]);
            hasAddedCurrentUser.current = true;
        }
    }, [currentUserId, selectedUsersIds, usersData]);

    // Clean user ids context if submission exited
    useEffect(() => {
        if (createNewOn) {
            setSelectedUsersIds([]);
        }
    }, [createNewOn]);

    // Handlers
    // Add user to selection (if not already selected)
    const handleAddSelectedUser = (newUserId: string) => {
        setSelectedUsersIds((prevSelectedUsersIds) => {
            if (!prevSelectedUsersIds.includes(newUserId)) {
                return [...prevSelectedUsersIds, newUserId];
            }
            return prevSelectedUsersIds;
        });

        const newUsers = usersData?.data.filter((user) => user.id === newUserId) || [];
        setSelectedUsersSmall((prevSelectedUsersSmall) => {
            const isAlreadySelected = prevSelectedUsersSmall.some((user) => user.id === newUserId);
            if (!isAlreadySelected) {
                return [...prevSelectedUsersSmall, ...newUsers];
            }
            return prevSelectedUsersSmall;
        });
    };

    // Remove user from selection (if not current user)
    const handleRemoveSelectedUser = (removeUserId: string) => {
        if (removeUserId === currentUserId) {
            return; // Do not remove current user
        }

        setSelectedUsersIds((prevSelectedUsersIds) =>
            prevSelectedUsersIds.filter((id) => id !== removeUserId)
        );
        setSelectedUsersSmall((prevSelectedUsersSmall) =>
            prevSelectedUsersSmall.filter((user) => user.id !== removeUserId)
        );
    };

    return (
        <>
            <div className="relative flex items-start">
                <Popover>
                    <PopoverTrigger asChild>
                        <div>
                            <SearchInput
                                placeholder="Search users..."
                                context="Workspace General"
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="relative left-0 bg-white overflow-y-auto max-h-64">
                        {usersData?.data
                            .filter((user) => !selectedUsersIds.includes(user.id))
                            .map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                >
                                    <Button
                                        type="button"
                                        onClick={() => handleAddSelectedUser(user.id)}
                                        className="bg-gray-50 text-black m-0 w-60 hover:bg-gray-50 hover:text-black"
                                    >
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="small-icon px-2"
                                        />
                                        <div className="flex whitespace-nowrap">
                                            {user?.fullName}
                                        </div>
                                    </Button>
                                </div>
                            ))}
                    </PopoverContent>
                </Popover>
            </div>
            <div
                className="flex items-center border border-gray-200 rounded-sm shadow-sm"
                style={{
                    height: "52px",
                }}
            >
                <input type="hidden" value={JSON.stringify(selectedUsersIds)} {...restFieldProps} />
                <div className="flex items-center">
                    {selectedUsersSmall?.map((user, index) => (
                        <div key={user.id}>
                            <SmallUserCard
                                user={user}
                                handleRemoveSelectedUser={handleRemoveSelectedUser}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UsersSelection;
