import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDiscussionComments } from "@/services/fetch/community/fetchDiscussionComments";

export const useDiscussionComments = (discussionId: number, parentCommentId: number | null, itemsPerPage: number, enabled?: boolean) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ["discussionComments", discussionId, parentCommentId],
        queryFn: ({ pageParam = 0 }) => fetchDiscussionComments(discussionId, parentCommentId, pageParam, itemsPerPage),
        getNextPageParam: (lastPage, allPages) => {
            const morePagesExist = lastPage?.length === itemsPerPage;
            if (morePagesExist) {
                return allPages.length;
            }
            return undefined;
        }
    })

    return { data, fetchNextPage, hasNextPage };
}