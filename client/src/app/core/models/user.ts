import {Role} from "../enums/role";
import {Group} from "./group";
import {Faculty} from "./faculty";

export interface User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  role: Role;
  groups: Group[];
  faculties: Faculty[];
}
