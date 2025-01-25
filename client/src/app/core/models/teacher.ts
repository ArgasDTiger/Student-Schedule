import { Degree } from "../enums/degree";

export interface Teacher {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  degree: Degree;
}
