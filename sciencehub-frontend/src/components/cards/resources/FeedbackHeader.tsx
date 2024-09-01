"use client";

import Tag from "@/src/components/elements/Tag";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Feedback } from "@/src/types/resourcesTypes";
import { calculateDaysAgo, formatDaysAgo } from "@/src/utils/functions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface FeedbackHeaderProps {
    feedback: Feedback;
    isLoading?: boolean;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ feedback, isLoading }) => {
    const router = useRouter();
    const pathname = usePathname();

    const navigateToFeedback = (feedbackId: number) => {
        const feedbackPathname = `/resources/feedback/${feedbackId}`;
        if (pathname !== feedbackPathname) {
            router.push(feedbackPathname);
        }
    };

    if (isLoading) {
        return <Skeleton className="w-full h-40 p-4 bg-gray-300" />;
    }

    return (
        <div className="p-4 bg-gray-50 border border-gray-300 rounded-md shadow-sm">
            <div className="flex items-center">
                {feedback?.users?.avatarUrl && (
                    <Image
                        src={feedback?.users?.avatarUrl}
                        alt="Picture of the user"
                        width={64}
                        height={64}
                        className="w-12 h-12 rounded-full"
                    />
                )}
                <div className="mx-4">
                    <span
                        className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/${feedback?.users?.username}/profile`);
                        }}
                    >
                        {feedback?.users?.fullName}
                    </span>
                    <div className="text-sm text-gray-500">
                        {feedback.createdAt && (
                            <span>{formatDaysAgo(calculateDaysAgo(feedback.createdAt))}</span>
                        )}
                    </div>
                </div>
                {feedback?.tags?.map((tag, index) => (
                    <Tag key={index} tag={tag} />
                ))}
            </div>
            <div className="pb-4 cursor-pointer" onClick={() => navigateToFeedback(feedback?.id)}>
                {feedback?.title && (
                    <h2 className="font-semibold text-lg pt-4">{feedback?.title}</h2>
                )}
                {feedback.description && <p className="text-base mt-2">{feedback.description}</p>}
            </div>
        </div>
    );
};

export default FeedbackHeader;
