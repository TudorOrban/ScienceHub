using System.ComponentModel;
using System.Reflection;

namespace sciencehub_backend.Shared.Enums
{
    public static class EnumExtensions
    {
        public static string GetDescription(this Enum value)
        {
            var field = value.GetType().GetField(value.ToString());
            var attribute = field.GetCustomAttribute<EnumDescriptionAttribute>();

            return attribute?.Description ?? value.ToString();
        }

        public static T ParseEnum<T>(string value) where T : Enum
        {
            foreach (var enumValue in Enum.GetValues(typeof(T)))
            {
                if (((Enum)enumValue).GetDescription() == value)
                {
                    return (T)enumValue;
                }
            }

            throw new ArgumentException($"Requested value '{value}' was not found.");
        }
    }
}
