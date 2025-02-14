export enum LessonType {
  Lecture = "Lecture",
  Practice = "Practice",
  Laboratory = "Laboratory",
}

export enum LessonTypeUkrainian {
  Lecture = "Лекція",
  Practice = "Практична",
  Laboratory = "Лабораторна ",
}

export const lessonTypes = Object.keys(LessonType).map((key) => ({
  key: LessonType[key as keyof typeof LessonType], // "Lecture", "Practice"...
  value: LessonTypeUkrainian[key as keyof typeof LessonTypeUkrainian], // "Лекція", "Практична"...
}));
