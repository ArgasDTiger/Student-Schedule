import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ScheduleComponent} from "./schedule/schedule.component";
import {ModeratorComponent} from "./moderator/moderator/moderator.component";
import {ManageGroupComponent} from "./moderator/manage-group/manage-group.component";
import {ModeratorOverviewComponent} from "./moderator/moderator-overview/moderator-overview.component";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'schedule/:id', component: ScheduleComponent },
  { path: 'schedule', component: ScheduleComponent },
  {
    path: 'moderator',
    children: [
      {
        path: ':id',
        component: ModeratorOverviewComponent,
        children: [
          { path: 'manage', component: ManageGroupComponent },
          { path: 'schedule', component: ScheduleComponent },
          { path: '', redirectTo: 'schedule', pathMatch: 'full' }
        ]
      },
      {
        path: '',
        component: ModeratorComponent,
        pathMatch: 'full'
      }
    ]
  },
  { path: '', redirectTo: '/schedule', pathMatch: 'full' },
];
