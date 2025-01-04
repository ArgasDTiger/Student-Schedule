using Microsoft.EntityFrameworkCore;
using Schedule.Entities;

namespace Schedule.Data;

public static class Seed
{
    public static async Task SeedDataAsync(this DbContext context)
    {
        if (!context.Set<Faculty>().Any())
        {
            var faculties = new List<Faculty>()
            {
                new() { Id = 1, Name = "Факультет математики та інформатики", CorpusNumber = 1},
                new() { Id = 2, Name = "Юридичний факультет", CorpusNumber = 4}
            };

            context.AddRange(faculties);
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<Group>().Any())
        {
            var groups = new List<Group>()
            {
                new() { GroupNumber = 201, Faculty = context.Set<Faculty>().FirstOrDefault(f => f.Name == "Факультет математики та інформатики")!},
                new() { GroupNumber = 207, Faculty = context.Set<Faculty>().FirstOrDefault(f => f.Name == "Факультет математики та інформатики")!},
                new() { GroupNumber = 201, Faculty = context.Set<Faculty>().FirstOrDefault(f => f.Name == "Юридичний факультет")!}
            };

            context.AddRange(groups);
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<Group>().Any())
        {
            var groups = new List<Group>()
            {
                new() { GroupNumber = 201, Faculty = context.Set<Faculty>().FirstOrDefault(f => f.Name == "Факультет математики та інформатики")!},
                new() { GroupNumber = 207, Faculty = context.Set<Faculty>().FirstOrDefault(f => f.Name == "Факультет математики та інформатики")!},
                new() { GroupNumber = 201, Faculty = context.Set<Faculty>().FirstOrDefault(f => f.Name == "Юридичний факультет")!}
            };

            context.AddRange(groups);
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<Student>().Any())
        {
            var students = new List<Student>
            {
                new()
                {
                    FirstName = "Богдан",
                    LastName = "Кіт",
                    MiddleName = "Богданович",
                    DateOfBirth = new DateTime(2003, 02, 11),
                    Email = "bohdankit@gmail.com",
                    Groups = new List<Group>
                    {
                        context.Set<Group>().FirstOrDefault(g => g.Faculty.Id == 1)!,
                    }
                },
                new()
                {
                    FirstName = "Іван",
                    LastName = "Човен",
                    MiddleName = "Денисович",
                    DateOfBirth = new DateTime(2002, 11, 01),
                    Email = "chovenivan@gmail.com",
                    Groups = new List<Group>
                    {
                        context.Set<Group>().FirstOrDefault(g => g.Faculty.Id == 2)!,
                    }
                },
                new()
                {
                    FirstName = "Катерина",
                    LastName = "Бойко",
                    MiddleName = "Василівна",
                    DateOfBirth = new DateTime(2001, 07, 08),
                    Email = "katyaboyko@gmail.com",
                    Groups = new List<Group>
                    {
                        context.Set<Group>().FirstOrDefault(g => g.Faculty.Id == 1)!,
                        context.Set<Group>().FirstOrDefault(g => g.Faculty.Id == 2)!,
                    }
                },
            };

            context.AddRange(students);
            
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<Moderator>().Any())
        {
            var moderators = new List<Moderator>()
            {
                new()
                {
                    FirstName = "Володимир",
                    LastName = "Селько",
                    MiddleName = "Богданович",
                    DateOfBirth = new DateTime(1987, 03, 11),
                    Email = "volodyaselko@gmail.com",
                    Faculties = [
                        context.Set<Faculty>().FirstOrDefault(f => f.Name == "Факультет математики та інформатики")!,
                    ],
                },
                new()
                {
                    FirstName = "Вадим",
                    LastName = "Пес",
                    MiddleName = "Юрійович",
                    DateOfBirth = new DateTime(1994, 08, 24),
                    Email = "vadympes@gmail.com",
                    Faculties = [
                        context.Set<Faculty>().FirstOrDefault(f => f.Name == "Юридичний факультет")!,
                    ],
                }
            };

            context.AddRange(moderators);
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<Admin>().Any())
        {
            var admins = new List<Admin>()
            {
                new()
                {
                    FirstName = "Адміністратор",
                    LastName = "Адміністратор",
                    MiddleName = "Адміністратор",
                    DateOfBirth = new DateTime(1999, 03, 11),
                    Email = "admin@gmail.com",
                }
            };

            context.AddRange(admins);
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<Lesson>().Any())
        {
            var lessons = new List<Lesson>()
            {
                new()
                {
                    Name = "Основи 3Д графіки",
                },
                new()
                {
                    Name = "Програмування мовою Python",
                },
                new()
                {
                    Name = "Комп'ютерні мережі",
                },
                new()
                {
                    Name = "Основи веб-технологій",
                },
                new()
                {
                    Name = "Математичний аналіз",
                },
                new()
                {
                    Name = "Правознавство",
                },
                new()
                {
                    Name = "Закони України",
                },
            };

            context.AddRange(lessons);
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<Teacher>().Any())
        {
            var teachers = new List<Teacher>
            {
                new()
                {
                    Id = 1,
                    FirstName = "Калина",
                    LastName = "Зарубайко",
                    MiddleName = "Петрівна",
                    Degree = Degree.Assistant
                },
                new()
                {
                    Id = 2,
                    FirstName = "Владислав",
                    LastName = "Мудрик",
                    MiddleName = "Тарасович",
                    Degree = Degree.Assistant
                },
                new()
                {
                    Id = 3,
                    FirstName = "Павло",
                    LastName = "Мартинюк",
                    MiddleName = "Леонідович",
                    Degree = Degree.AssociateProfessor
                },
                new()
                {
                    Id = 4,
                    FirstName = "Дарія",
                    LastName = "Макар",
                    MiddleName = "Сергіївна",
                    Degree = Degree.AssociateProfessor
                },
                new()
                {
                    Id = 5,
                    FirstName = "Богдана",
                    LastName = "Корт",
                    MiddleName = "Олегівна",
                    Degree = Degree.Professor
                },
                new()
                {
                    Id = 6,
                    FirstName = "Станіслав",
                    LastName = "Мельник",
                    MiddleName = "Васильович",
                    Degree = Degree.Professor
                },
            };

            context.AddRange(teachers);
            await context.SaveChangesAsync();
        }
        
        if (!context.Set<LessonGroup>().Any())
        {
            var lessonGroups = new List<LessonGroup>()
            {
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Основи 3Д графіки")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 1)!,
                    WeekDay = DayOfWeek.Tuesday,
                    LessonNumber = LessonNumber.First,
                    Type = LessonType.Laboratory,
                    Room = 39,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Програмування мовою Python")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 3)!,
                    WeekDay = DayOfWeek.Thursday,
                    LessonNumber = LessonNumber.Second,
                    Type = LessonType.Laboratory,
                    Room = 11,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Програмування мовою Python")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 207 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 3)!,
                    WeekDay = DayOfWeek.Monday,
                    LessonNumber = LessonNumber.First,
                    Type = LessonType.Laboratory,
                    Room = 11,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Програмування мовою Python")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 207 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 3)!,
                    WeekDay = DayOfWeek.Monday,
                    LessonNumber = LessonNumber.Second,
                    Type = LessonType.Lecture,
                    Room = 16,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Програмування мовою Python")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 3)!,
                    WeekDay = DayOfWeek.Monday,
                    LessonNumber = LessonNumber.Second,
                    Type = LessonType.Lecture,
                    Room = 16,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Комп'ютерні мережі")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 3)!,
                    WeekDay = DayOfWeek.Wednesday,
                    LessonNumber = LessonNumber.Second,
                    Type = LessonType.Practice,
                    Room = 14,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Комп'ютерні мережі")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 207 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 5)!,
                    WeekDay = DayOfWeek.Friday,
                    LessonNumber = LessonNumber.Second,
                    Type = LessonType.Practice,
                    Room = 14,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Основи веб-технологій")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 1)!,
                    WeekDay = DayOfWeek.Thursday,
                    LessonNumber = LessonNumber.First,
                    Type = LessonType.Practice,
                    Room = 14,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Математичний аналіз")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 6)!,
                    WeekDay = DayOfWeek.Friday,
                    LessonNumber = LessonNumber.First,
                    Type = LessonType.Lecture,
                    Room = 10,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Математичний аналіз")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 207 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 6)!,
                    WeekDay = DayOfWeek.Friday,
                    LessonNumber = LessonNumber.First,
                    Type = LessonType.Lecture,
                    Room = 10,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Математичний аналіз")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 6)!,
                    WeekDay = DayOfWeek.Tuesday,
                    LessonNumber = LessonNumber.Second,
                    Type = LessonType.Practice,
                    Room = 22,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Математичний аналіз")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 207 && g.Faculty.Name == "Факультет математики та інформатики")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 6)!,
                    WeekDay = DayOfWeek.Tuesday,
                    LessonNumber = LessonNumber.Third,
                    Type = LessonType.Practice,
                    Room = 21,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Правознавство")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Юридичний факультет")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 2)!,
                    WeekDay = DayOfWeek.Tuesday,
                    LessonNumber = LessonNumber.First,
                    Type = LessonType.Practice,
                    Room = 17,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Правознавство")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Юридичний факультет")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 2)!,
                    WeekDay = DayOfWeek.Monday,
                    LessonNumber = LessonNumber.First,
                    Type = LessonType.Lecture,
                    Room = 18,
                    OddWeek = true,
                    EvenWeek = true
                },
                new()
                {
                    Lesson = context.Set<Lesson>().FirstOrDefault(l => l.Name == "Закони України")!,
                    Group = context.Set<Group>().FirstOrDefault(g => g.GroupNumber == 201 && g.Faculty.Name == "Юридичний факультет")!,
                    Teacher = context.Set<Teacher>().FirstOrDefault(t => t.Id == 4)!,
                    WeekDay = DayOfWeek.Monday,
                    LessonNumber = LessonNumber.Second,
                    Type = LessonType.Lecture,
                    Room = 14,
                    OddWeek = true,
                    EvenWeek = true
                },
            };

            context.AddRange(lessonGroups);
            await context.SaveChangesAsync();
        }
    }
}