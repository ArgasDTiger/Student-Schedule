using Schedule.DataLoaders;
using Schedule.Entities;
using Schedule.Interfaces;

namespace Schedule.Data;

public class DataLoaderContext
{
    public DataLoaderContext(IServiceProvider serviceProvider)
    {
        LessonById = new DataLoaderWithIntId<Lesson>(
            serviceProvider.GetRequiredService<IBatchScheduler>(),
            new DataLoaderOptions { MaxBatchSize = 100 },
            serviceProvider.GetRequiredService<IRepository>()
        );

        TeacherById = new DataLoaderWithIntId<Teacher>(
            serviceProvider.GetRequiredService<IBatchScheduler>(),
            new DataLoaderOptions { MaxBatchSize = 100 },
            serviceProvider.GetRequiredService<IRepository>()
        );

        GroupById = new DataLoaderWithIntId<Group>(
            serviceProvider.GetRequiredService<IBatchScheduler>(),
            new DataLoaderOptions { MaxBatchSize = 100 },
            serviceProvider.GetRequiredService<IRepository>()
        );

        FacultyById = new DataLoaderWithIntId<Faculty>(
            serviceProvider.GetRequiredService<IBatchScheduler>(),
            new DataLoaderOptions { MaxBatchSize = 100 },
            serviceProvider.GetRequiredService<IRepository>()
        );
        
        LessonGroupById = new DataLoaderWithIntId<LessonGroup>(
            serviceProvider.GetRequiredService<IBatchScheduler>(),
            new DataLoaderOptions { MaxBatchSize = 100 },
            serviceProvider.GetRequiredService<IRepository>()
        );
    }

    public IDataLoader<int, Lesson> LessonById { get; }
    public IDataLoader<int, Teacher> TeacherById { get; }
    public IDataLoader<int, Group> GroupById { get; }
    public IDataLoader<int, Faculty> FacultyById { get; }
    public IDataLoader<int, LessonGroup> LessonGroupById { get; }
}
