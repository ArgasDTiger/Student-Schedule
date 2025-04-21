export enum LessonNumberString {
  First = "First",
  Second = "Second",
  Third = "Third",
  Fourth = "Fourth",
  Fifth = "Fifth",
}

export enum LessonNumber {
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
  Fifth = 5,
}

export function convertLessonNumber(input: LessonNumber | LessonNumberString): LessonNumber | LessonNumberString {
  const numberToStringMap: Record<LessonNumber, LessonNumberString> = {
    [LessonNumber.First]: LessonNumberString.First,
    [LessonNumber.Second]: LessonNumberString.Second,
    [LessonNumber.Third]: LessonNumberString.Third,
    [LessonNumber.Fourth]: LessonNumberString.Fourth,
    [LessonNumber.Fifth]: LessonNumberString.Fifth,
  };

  const stringToNumberMap: Record<LessonNumberString, LessonNumber> = {
    [LessonNumberString.First]: LessonNumber.First,
    [LessonNumberString.Second]: LessonNumber.Second,
    [LessonNumberString.Third]: LessonNumber.Third,
    [LessonNumberString.Fourth]: LessonNumber.Fourth,
    [LessonNumberString.Fifth]: LessonNumber.Fifth,
  };

  if (typeof input === "number") {
    return numberToStringMap[input] ?? null;
  } else {
    return stringToNumberMap[input] ?? null;
  }
}

export function convertLessonNumberToNumber(input: LessonNumberString): LessonNumber {
  const stringToNumberMap: Record<LessonNumberString, LessonNumber> = {
    [LessonNumberString.First]: LessonNumber.First,
    [LessonNumberString.Second]: LessonNumber.Second,
    [LessonNumberString.Third]: LessonNumber.Third,
    [LessonNumberString.Fourth]: LessonNumber.Fourth,
    [LessonNumberString.Fifth]: LessonNumber.Fifth,
  };

  return stringToNumberMap[input] || 0;
}
