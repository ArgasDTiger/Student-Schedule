import {DayOfWeek} from "../enums/dayOfWeek";
import {LessonNumberString} from "../enums/lessonNumber";

export interface GetTeacherInput {
  search: string | null;
  weekDay: DayOfWeek | null;
  lessonNumber: LessonNumberString | null;
  lessonInfoId: number | null;
}
