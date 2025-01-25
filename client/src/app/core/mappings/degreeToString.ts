import {Degree} from "../enums/degree";

export const degreeToString: Record<Degree, string> = {
  [Degree.Assistant]: 'Асистент',
  [Degree.AssociateProfessor]: 'Доцент',
  [Degree.Professor]: 'Професор',
}
