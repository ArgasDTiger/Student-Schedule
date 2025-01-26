import { Routes } from '@angular/router';
import {ScheduleComponent} from "./shared/schedule/schedule.component";
import {LoginComponent} from "./login/login.component";

export const routes: Routes = [
  { path: '', component: ScheduleComponent },
  { path: 'login', component: LoginComponent },
];
