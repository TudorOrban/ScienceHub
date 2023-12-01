import { User } from "@/types/userTypes";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faXmark } from "@fortawesome/free-solid-svg-icons";

interface SmallUserCardProps {
    user: User;
    handleRemoveSelectedUser?: (userId: string) => void;
}

const SmallUserCard: React.FC<SmallUserCardProps> = ({
    user,
    handleRemoveSelectedUser,
}) => {
    return (
        <div
            className="flex items-center h-12 px-2 bg-gray-50 border border-gray-200 shadow-sm rounded-md"
        >
            <FontAwesomeIcon icon={faUser} className="small-icon px-2" />
            <div className="flex whitespace-nowrap font-semibold text-sm">
                {user?.fullName}
            </div>
            {handleRemoveSelectedUser && (
                <button
                    type="button"
                    onClick={() => handleRemoveSelectedUser(user.id)}
                    className="bg-gray-50 text-black pl-2 pr-1 hover:bg-gray-50"
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="small-icon text-gray-500 hover:text-red-700"
                    />
                </button>
            )}
        </div>
    );
};

export default SmallUserCard;