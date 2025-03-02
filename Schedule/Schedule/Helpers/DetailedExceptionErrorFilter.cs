using Schedule.Exceptions;

namespace Schedule.Helpers;

public class DetailedExceptionErrorFilter : IErrorFilter
{
    public IError OnError(IError error)
    {
        if (error.Exception is BaseException baseException)
        {
            return error.WithMessage(baseException.Message);
        }

        return error.WithMessage("Internal Server Error");
    }
}