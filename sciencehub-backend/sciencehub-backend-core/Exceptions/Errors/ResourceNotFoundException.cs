namespace sciencehub_backend_core.Exceptions.Errors
{
    public class ResourceNotFoundException : Exception
    {
        public ResourceNotFoundException(string resourceType, string resourceId) 
            : base($"Resource of type {resourceType} with ID {resourceId} not found.")
        {
        }
    }
}