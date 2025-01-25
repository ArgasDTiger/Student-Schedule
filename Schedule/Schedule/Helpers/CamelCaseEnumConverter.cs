using System.Reflection;
using HotChocolate.Types.Descriptors;

namespace Schedule.Helpers;

public class PascalCaseEnumConverter : DefaultNamingConventions
{
    public override string GetEnumValueName(object value)
    {
        ArgumentNullException.ThrowIfNull(value);

        var enumType = value.GetType();

        if (enumType.IsEnum)
        {
            var enumMember = enumType
                .GetMember(value.ToString()!)
                .FirstOrDefault();

            if (enumMember is not null &&
                enumMember.IsDefined(typeof(GraphQLNameAttribute)))
            {
                return enumMember.GetCustomAttribute<GraphQLNameAttribute>()!.Name;
            }
        }
        return value.ToString();
    }
}