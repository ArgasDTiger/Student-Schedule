import {LessonNumberString} from "../enums/lessonNumber";

export const lessonNumberToTimeSpanMap: Record<LessonNumberString, string> = {
  [LessonNumberString.First]: "8:20 - 9:40",
  [LessonNumberString.Second]: "9:50 - 11:10",
  [LessonNumberString.Third]: "11:30 - 12:50",
  [LessonNumberString.Fourth]: "13:00 - 14:20",
  [LessonNumberString.Fifth]: "14:40 - 16:00",
};
