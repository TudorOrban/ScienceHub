namespace sciencehub_backend.Shared.Enums
{
    [AttributeUsage(AttributeTargets.Field)]
    public class EnumDescriptionAttribute : Attribute
    {
        public string Description { get; }

        public EnumDescriptionAttribute(string description)
        {
            Description = description;
        }
    }

}
