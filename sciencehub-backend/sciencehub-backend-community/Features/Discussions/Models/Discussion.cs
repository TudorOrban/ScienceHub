using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using sciencehub_backend_community.Core.Users.Models;

namespace sciencehub_backend_community.Features.Discussions.Models
{
    [Table("discussions")]
    public class Discussion
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public Guid UserId { get; set; }

        [NotMapped] 
        public User? User { get; set; }
        
        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("title")]
        public string Title { get; set; }

        [Column("content")]
        public string? Content { get; set; }
        
        [NotMapped] 
        public List<Comment>? DiscussionComments { get; set; }
        
        [Column("link")]
        public string? Link { get; set; }
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

        [NotMapped] 
        public User? users { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("parent_comment_id")]
        public int? ParentCommentId { get; set; }

        [Column("content")]
        public string? Content { get; set; }

        [Column("children_comments_count")]
        public int? ChildrenCommentsCount { get; set; }

        [NotMapped] 
        public int? CommentRepostsCount { get; set; }
        
        [NotMapped] 
        public int? CommentBookmarksCount { get; set; }

        [NotMapped] 
        public List<Comment>? Comments { get; set; }

        [Column("link")]
        public string? Link { get; set; }        
    }
}