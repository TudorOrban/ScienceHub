
import { CommentInfo } from "@/types/infoTypes";
import dynamic from "next/dynamic";
const CommentItem = dynamic(() => import("@/components/items/community/CommentItem"));

type CommentListProps = {
    commentsInfo: CommentInfo[];
};

const findDescendants = (
    comments: CommentInfo[],
    parentId: string
): CommentInfo[] => {
    const children = comments.filter(
        (c) => String(c.parentCommentId) === parentId
    );
    let descendants = [...children];

    for (const child of children) {
        descendants = [
            ...descendants,
            ...findDescendants(comments, (child.id || "").toString()),
        ];
    }

    return descendants;
};

const CommentList: React.FC<CommentListProps> = ({ commentsInfo }) => {
    const topLevelComments = commentsInfo.filter((c) => !c.parentCommentId);

    return (
        <>
            {topLevelComments.length > 0 ? topLevelComments.map((comment) => {
                const descendants = findDescendants(
                    commentsInfo,
                    (comment.id || "").toString()
                );

                return (
                    <CommentItem
                        key={comment.id}
                        commentInfo={comment}
                        descendants={descendants}
                        depth={0}
                        onDeleteComment={() => {}}
                    />
                );
            }) : null}
        </>
    );
};

export default CommentList;
