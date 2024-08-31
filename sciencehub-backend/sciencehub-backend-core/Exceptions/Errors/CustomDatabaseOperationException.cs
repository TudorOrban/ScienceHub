namespace sciencehub_backend_core.Exceptions.Errors
{
    public class CustomDatabaseOperationException : Exception
    {
        public CustomDatabaseOperationException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
