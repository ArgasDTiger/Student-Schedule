import {DayOfWeek} from "../enums/dayOfWeek";
import {LessonNumberString} from "../enums/lessonNumber";
import {LessonType} from "../enums/lessonType";

export interface AddLessonInfoInput {
  lessonId: number;
  groupId: number;
  teacherId: number;
  weekDay: DayOfWeek;
  lessonNumber: LessonNumberString;
  type: LessonType;
  room: number;
  oddWeek: boolean;
  evenWeek: boolean;
}
