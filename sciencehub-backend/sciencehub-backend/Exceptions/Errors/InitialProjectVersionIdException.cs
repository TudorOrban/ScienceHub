namespace sciencehub_backend.Exceptions.Errors
{
    public class InvalidProjectVersionIdException : Exception
    {
        public InvalidProjectVersionIdException() : base("Invalid project version ID.")
        {
        }
    }
}
