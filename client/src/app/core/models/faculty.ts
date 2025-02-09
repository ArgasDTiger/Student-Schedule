import {Group} from "./group";

export interface Faculty {
  id: number;
  name: string;
  corpusNumber: number;
  groups: Group[];
}
