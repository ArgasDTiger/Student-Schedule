import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ScheduleComponent} from "./schedule/schedule.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'schedule/:id', component: ScheduleComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: '', redirectTo: '/schedule', pathMatch: 'full' },
];
