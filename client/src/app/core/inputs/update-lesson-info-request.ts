import {Group} from "../models/group";
import {Teacher} from "../models/teacher";
import {DayOfWeek} from "../enums/dayOfWeek";
import {LessonNumberString} from "../enums/lessonNumber";
import {LessonType} from "../enums/lessonType";

export interface UpdateLessonInfoRequest {
  id: number;
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
