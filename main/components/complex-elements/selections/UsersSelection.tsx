import Popover from "@/components/light-simple-elements/Popover";
import { useUsersSearch } from "@/hooks/fetch/search-hooks/community/useUsersSearch";
import { User } from "@/types/userTypes";
import { faSearch, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useReusableSearchContext } from "@/contexts/search-contexts/ReusableSearchContext";
import SmallUserCard from "@/components/elements/SmallUserCard";

type UsersSelectionProps = {
    selectedUsers: User[];
    setSelectedUsers: (users: User[]) => void;
    currentUser?: User;
    inputClassName?: string;
    width?: number; // in px
};

const UsersSelection: React.FC<UsersSelectionProps> = ({
    selectedUsers,
    setSelectedUsers,
    currentUser,
    inputClassName,
    width,
}) => {
    const defaultWidth = 256;

    // States
    const [localInputQuery, setLocalInputQuery] = useState<string>("");
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    // Contexts
    const { inputQuery, setInputQuery } = useReusableSearchContext();

    // Custom hooks
    // TODO: All users, TBM later
    const usersData = useUsersSearch({
        extraFilters: {},
        enabled: true,
        context: "Reusable",
    });

    // Handlers
    // - Add user to selection (if not already selected)
    const handleAddSelectedUser = (newUser: User) => {
        if (!selectedUsers.some((user) => user.id === newUser.id)) {
            setSelectedUsers([...selectedUsers, newUser]);
        }
    };

    // - Remove user from selection (if not current user)
    const handleRemoveSelectedUser = (removeUserId: string) => {
        const users: User[] = selectedUsers.filter((user) => user.id !== removeUserId);
        if (!currentUser?.id || (currentUser?.id && removeUserId !== currentUser.id)) {
            setSelectedUsers(users);
        }
    };

    // Handle search query
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        setLocalInputQuery(inputValue);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            setInputQuery(localInputQuery);
        }
    };

    return (
        <div>
            <Popover
                button={{
                    label: "",
                    icon: undefined,
                }}
                buttonChildren={
                    <div className="flex items-center rounded-r-md">
                        <input
                            placeholder={"Search users..."}
                            value={localInputQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={() => setIsPopoverOpen(true)}
                            className={`px-2 focus:outline-none ${inputClassName || ""}`}
                            style={{ minWidth: "80px", width: width || defaultWidth }}
                        />
                        <button
                            onClick={() => setInputQuery(localInputQuery)}
                            className="search-button"
                        >
                            <FontAwesomeIcon icon={faSearch} className="small-icon" />
                        </button>
                    </div>
                }
                isOpen={isPopoverOpen}
                setIsOpen={setIsPopoverOpen}
            >
                <div
                    className={`grid justify-center w-64 max-h-96 overflow-y-auto overflow-x-hidden space-y-0.5 p-0.5`}
                    style={{ width: width || defaultWidth }}
                >
                    {usersData?.data
                        .filter(
                            (user) =>
                                !selectedUsers.some((selectedUser) => selectedUser.id === user.id)
                        )
                        .map((user, index) => (
                            <SmallUserCard
                                user={user}
                                handleAddSelectedUser={handleAddSelectedUser}
                                key={user.id}
                            />
                        ))}
                </div>
            </Popover>
            {selectedUsers.length > 0 && (
                <div className="flex items-center flex-wrap pt-1">
                    {selectedUsers?.map((user, index) => (
                        <SmallUserCard
                            user={user}
                            handleRemoveSelectedUser={handleRemoveSelectedUser}
                            className={inputClassName || ""}
                            key={user.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UsersSelection;
