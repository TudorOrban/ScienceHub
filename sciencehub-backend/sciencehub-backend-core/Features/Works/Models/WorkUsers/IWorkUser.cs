namespace sciencehub_backend_core.Features.Works.Models.WorkUsers
{
    public interface IWorkUser
    {
        Guid UserId { get; }
        string Role { get; }
    }

}