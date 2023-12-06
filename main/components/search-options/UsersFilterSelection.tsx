import { useUsersSearch } from "@/app/hooks/fetch/search-hooks/community/useUsersSearch";
import { User } from "@/types/userTypes";
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import SearchInput from "../complex-elements/SearchInput";
import { UsersSelectionContext } from "@/app/contexts/selections/UsersSelectionContext";
import { useBrowseSearchContext } from "@/app/hooks/fetch/search-hooks/useBrowseSearchContext";

import dynamic from "next/dynamic";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type UsersFilterSelectionProps = {
    context: string;
    browseMode?: boolean;
};

const UsersFilterSelection: React.FC<UsersFilterSelectionProps> = ({
    context,
    browseMode,
}) => {
    // States
    // - State keeping track of selected users' small info
    const [selectedUsersSmall, setSelectedUsersSmall] = useState<User[]>([]);

    // Contexts
    // - Selected users small
    // TODO: Fix this mess
    const browseContext = useBrowseSearchContext(context);

    let [users, setUsers] = useState<User[]>([]);
    if (!browseContext) {
        // throw new Error(
        //     "BrowseWorksSearchContext must be used within a BrowseWorksSearchProvider"
        // );
    } else {
        const context = {
            userSetStates: { users, setUsers },
        } = browseContext;
        users = users;
        setUsers = setUsers;
    }
    

    // - User selection
    const usersSelectionContext = useContext(UsersSelectionContext);
    if (!usersSelectionContext) {
        throw new Error("UsersSelectionContext must be used within a Provider");
    }
    const { selectedUsersIds, setSelectedUsersIds } = usersSelectionContext;

    // Custom hooks
    // TODO: All users, TBM later
    const usersData = useUsersSearch({
        extraFilters: {},
        enabled: true,
        context: "Workspace General",
    });

    // Effects
    // - Update browse active selection (TODO: generalize to other browse pages)
    useEffect(() => {
        if (browseMode && users !== selectedUsersSmall) {
            setUsers(selectedUsersSmall);
        }
    }, [selectedUsersSmall]);

    // Handlers
    // - Add user to selection (if not already selected)
    const handleAddSelectedUser = (newUserId: string) => {
        setSelectedUsersIds((prevSelectedUsersIds) => {
            if (!prevSelectedUsersIds.includes(newUserId)) {
                return [...prevSelectedUsersIds, newUserId];
            }
            return prevSelectedUsersIds;
        });

        // Update selectedUsersSmall
        const newUsers =
            usersData?.data.filter((user) => user.id === newUserId) || [];
        setSelectedUsersSmall((prevSelectedUsersSmall) => {
            const isAlreadySelected = prevSelectedUsersSmall.some(
                (user) => user.id === newUserId
            );
            if (!isAlreadySelected) {
                return [...prevSelectedUsersSmall, ...newUsers];
            }
            return prevSelectedUsersSmall;
        });
    };

    // - Remove user from selection (if not current user)
    const handleRemoveSelectedUser = (removeUserId: string) => {
        setSelectedUsersIds((prevSelectedUsersIds) =>
            prevSelectedUsersIds.filter((id) => id !== removeUserId)
        );
        setSelectedUsersSmall((prevSelectedUsersSmall) =>
            prevSelectedUsersSmall.filter((user) => user.id !== removeUserId)
        );
    };

    return (
        <div className="flex-none">
            <div className="w-[176px]">
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="pt-1">
                            <SearchInput
                                placeholder="Search users..."
                                context="Workspace General"
                                inputClassName="w-[176px]"
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="relative bg-white overflow-y-auto overflow-x-hidden max-h-64 left-5 w-[218px] z-40">
                        <div className="grid">
                            {usersData?.data
                                .filter(
                                    (user) =>
                                        !selectedUsersIds.includes(user.id)
                                )
                                .map((user, index) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                                    >
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleAddSelectedUser(user.id)
                                            }
                                            className="bg-gray-50 text-black m-0 w-40 hover:bg-gray-50 hover:text-black"
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
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="pt-1">
                {selectedUsersSmall?.map((user, index) => (
                    <div
                        key={user?.id}
                        className="flex items-center ml-1 pr-2 bg-gray-50 border border-gray-200 shadow-sm rounded-md"
                    >
                        <FontAwesomeIcon
                            icon={faUser}
                            className="small-icon px-2"
                        />
                        <div className="flex-grow whitespace-nowrap font-semibold text-sm">
                            {user?.fullName}
                        </div>
                        <Button
                            type="button"
                            onClick={() => handleRemoveSelectedUser(user.id)}
                            className="bg-gray-50 text-black pl-2 pr-1 py-1 hover:bg-gray-50"
                        >
                            <FontAwesomeIcon
                                icon={faXmark}
                                className="small-icon text-gray-500 hover:text-red-700"
                            />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersFilterSelection;
