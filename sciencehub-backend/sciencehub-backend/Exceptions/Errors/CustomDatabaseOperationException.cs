namespace sciencehub_backend.Exceptions.Errors
{
    public class CustomDatabaseOperationException : Exception
    {
        public CustomDatabaseOperationException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
