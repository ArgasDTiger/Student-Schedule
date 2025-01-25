import {LessonType} from "../enums/lessonType";

export const lessonTypeToString: Record<LessonType, string> = {
  [LessonType.Laboratory]: "Лабораторна",
  [LessonType.Lecture]: "Лекція",
  [LessonType.Practice]: "Практична",
}
