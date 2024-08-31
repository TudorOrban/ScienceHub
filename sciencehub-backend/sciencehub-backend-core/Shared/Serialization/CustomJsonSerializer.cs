using System.Text.Json;

namespace sciencehub_backend_core.Shared.Serialization
{
    public class CustomJsonSerializer
    {
        public string SerializeToJson<T>(T objectToSerialize)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
            return JsonSerializer.Serialize(objectToSerialize, options);
        }

        public T DeserializeFromJson<T>(string jsonString)
        {
            if (string.IsNullOrEmpty(jsonString))
                return default(T);

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
            return JsonSerializer.Deserialize<T>(jsonString, options);
        }

    }
}