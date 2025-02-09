import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ScheduleComponent} from "./schedule/schedule.component";
import {ModeratorComponent} from "./moderator/moderator.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'schedule/:id', component: ScheduleComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'moderator', component: ModeratorComponent },
  { path: 'moderator/:id/schedule', component: ScheduleComponent },
  { path: '', redirectTo: '/schedule', pathMatch: 'full' },
];
