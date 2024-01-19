namespace sciencehub_backend.Exceptions.Errors
{
    public class InvalidUserIdException : Exception
    {
        public InvalidUserIdException() : base("Invalid user ID.")
        {
        }
    }
}
