import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ScheduleComponent} from "./schedule/schedule.component";
import {ModeratorComponent} from "./moderator/moderator/moderator.component";
import {ManageGroupComponent} from "./moderator/manage-group/manage-group.component";
import {ModeratorOverviewComponent} from "./moderator/moderator-overview/moderator-overview.component";
import {AdminDashboardComponent} from "./admin/admin-dashboard/admin-dashboard.component";
import {AdminFacultyComponent} from "./admin/admin-faculty/admin-faculty.component";
import {ManageLessonsComponent} from "./admin/admin-dashboard/manage-lessons/manage-lessons.component";
import {ManageTeachersComponent} from "./admin/admin-dashboard/manage-teachers/manage-teachers.component";
import {ManageStudentsComponent} from "./admin/admin-dashboard/manage-students/manage-students.component";
import {ManageModeratorsComponent} from "./admin/admin-faculty/manage-moderators/manage-moderators.component";
import {ManageGroupsComponent} from "./admin/admin-faculty/manage-groups/manage-groups.component";

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
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        children: [
          { path: 'lessons', component: ManageLessonsComponent },
          { path: 'teachers', component: ManageTeachersComponent },
          { path: 'students', component: ManageStudentsComponent },
          { path: '', redirectTo: 'lessons', pathMatch: 'full' }
        ]
      },
      {
        path: 'faculty/:id',
        component: AdminFacultyComponent,
        children: [
          { path: 'moderators', component: ManageModeratorsComponent },
          { path: 'groups', component: ManageGroupsComponent },
          { path: '', redirectTo: 'moderators', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/schedule', pathMatch: 'full' },
];
