import { Team } from "@/types/communityTypes";
import { User } from "@/types/userTypes";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface UsersAndTeamsSmallUIProps {
    label?: string;
    users: User[];
    teams: Team[];
    isLoading?: boolean;
    disableIcon?: boolean;
    className?: string;
}

/**
 * Component to be used throughout the app to display an object's users and teams.
 */
const UsersAndTeamsSmallUI: React.FC<UsersAndTeamsSmallUIProps> = ({
    label,
    users,
    teams,
    isLoading,
    disableIcon,
    className,
}) => {
    if (isLoading) {
        return <Skeleton className="w-20 h-4 bg-gray-400 ml-2" />;
    }

    return (
        <div className={`flex items-center text-gray-800 flex-wrap ${className || ""}`}>
            {!disableIcon && (
                <FontAwesomeIcon
                    className="small-icon"
                    icon={faUser}
                    style={{
                        marginLeft: "0.2em",
                        marginRight: "0.25em",
                        marginBottom: "0.1em",
                    }}
                    color="#444444"
                />
            )}
            {label && <span className="whitespace-nowrap block font-semibold">{label}</span>}
            {(users || []).map((user, index) => (
                <Link key={user.id} href={`/${user.username}/profile`}>
                    <span className="ml-1 text-blue-600 hover:text-blue-800 block">
                        {index !== (users || []).length - 1
                            ? `${user?.fullName}, `
                            : user?.fullName || ""}
                    </span>
                </Link>
            ))}
            {!!teams && teams.length > 0 && ", "}
            {(teams || []).map((team, index) => (
                <Link key={team.id} href={`/${team.teamUsername}/profile`}>
                    <span className="ml-1 text-blue-600 hover:text-blue-800 block">
                        {index !== (users || []).length - 1 ? `${team.teamName}, ` : team.teamName}
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default UsersAndTeamsSmallUI;
