import {DayOfWeek} from "../enums/dayOfWeek";

export const dayOfWeekToString: Record<DayOfWeek, string> = {
  [DayOfWeek.Monday]: "Понеділок",
  [DayOfWeek.Tuesday]: "Вівторок",
  [DayOfWeek.Wednesday]: "Середа",
  [DayOfWeek.Thursday]: "Четвер",
  [DayOfWeek.Friday]: "П’ятниця",
  [DayOfWeek.Saturday]: "Субота",
  [DayOfWeek.Sunday]: "Неділя",
};
