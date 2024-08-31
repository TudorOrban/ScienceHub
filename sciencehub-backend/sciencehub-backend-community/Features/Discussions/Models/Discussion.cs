using sciencehub_backend_community.Core.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sciencehub_backend_community.Features.Discussions.Models
{
    [Table("discussions")]
    public class Discussion
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }

        public User User { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("content")]
        public string Content { get; set; }
        
        public List<Comment> DiscussionComments { get; set; }
        
        [Column("link")]
        public string Link { get; set; }
    }

    [Table("discussion_comments")]
    public  class Comment
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }

        [Column("user_id")]
        public string UserId { get; set; }

        [Column("discussion_id")]
        public int DiscussionId { get; set; }

        public User users { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [Column("parent_comment_id")]
        public int? ParentCommentId { get; set; }

        [Column("content")]
        public string Content { get; set; }
        

        [Column("children_comments_count")]
        public int ChildrenCommentsCount { get; set; }

        public int CommentRepostsCount { get; set; }
        public int CommentBookmarksCount { get; set; }
        public List<Comment> Comments { get; set; }

        [Column("link")]
        public string Link { get; set; }        
    }
}