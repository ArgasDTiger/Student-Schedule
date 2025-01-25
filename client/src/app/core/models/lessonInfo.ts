import {Lesson} from "./lesson";
import {Group} from "./group";
import {Teacher} from "./teacher";
import {DayOfWeek} from "../enums/dayOfWeek";
import {LessonType} from "../enums/lessonType";
import {LessonNumberString} from "../enums/lessonNumber";

export interface LessonInfo {
  lesson: Lesson;
  group: Group;
  teacher: Teacher;
  weekDay: DayOfWeek;
  lessonNumber: LessonNumberString;
  type: LessonType;
  room: number;
  oddWeek: boolean;
  evenWeek: boolean;
}
