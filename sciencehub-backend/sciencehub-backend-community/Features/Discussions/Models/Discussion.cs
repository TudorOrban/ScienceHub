namespace sciencehub_backend_community.Features.Discussions.Models
{
    public class Discussion
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public List<Comment> DiscussionComments { get; set; }
        public int DiscussionRepostsCount { get; set; }
        public int DiscussionBookmarksCount { get; set; }
        public string Link { get; set; }
    }

    public  class Comment
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public int DiscussionId { get; set; }
        public User users { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? ParentCommentId { get; set; }
        public string Content { get; set; }
        public List<Comment> Comments { get; set; }
        public int ChildrenCommentsCount { get; set; }
        public int CommentRepostsCount { get; set; }
        public int CommentBookmarksCount { get; set; }
        public string Link { get; set; }        
    }
}