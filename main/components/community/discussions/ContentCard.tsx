import { Skeleton } from "@/components/ui/skeleton";
import { Discussion, Comment } from "@/types/communityTypes";
import { calculateDaysAgo, formatDaysAgo } from "@/utils/functions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface ContentCardProps {
    content: Discussion | Comment;
    discussionId: number;
    isDiscussion?: boolean;
    isLoading?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
    content,
    discussionId,
    isDiscussion,
    isLoading,
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const navigateToDiscussionOrContent = (username: string) => {
        const discussionUrl = isDiscussion ? `/${username}/community/discussions/${discussionId}` : `/${username}/community/discussions/${discussionId}/comments/${content.id}`;
        if (pathname !== discussionUrl && !!username) {
            router.push(discussionUrl);
        }
    };

    if (isLoading) {
        return (
            <Skeleton className="w-full h-40 p-4 bg-gray-300" />
        )
    }
    
    return (
        <>
            <div className="flex items-center p-4">
                {content?.users?.avatarUrl && (
                    <Image
                        src={content?.users?.avatarUrl}
                        alt="Picture of the user"
                        width={64}
                        height={64}
                        className="w-12 h-12 rounded-full"
                    />
                )}
                <div className="ml-4">
                    <span
                        className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${content?.users?.username}/profile`);
                        }}
                    >
                        {content?.users?.fullName}
                    </span>
                    <div className="text-sm text-gray-500">
                        {content.createdAt && (
                            <span>{formatDaysAgo(calculateDaysAgo(content.createdAt))}</span>
                        )}
                    </div>
                </div>
            </div>
            <div
                className="px-4 pb-4 cursor-pointer"
                onClick={() => navigateToDiscussionOrContent(content?.users?.username || "")}
            >
                {(content as Discussion)?.title && (
                    <h2 className="font-semibold text-xl mt-2">{(content as Discussion)?.title}</h2>
                )}
                {content.content && <p className="text-base mt-2">{content.content}</p>}
            </div>
        </>
    )
}

export default ContentCard;