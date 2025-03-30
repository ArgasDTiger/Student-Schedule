import { Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ScheduleComponent } from "./schedule/schedule.component";
import { ModeratorComponent } from "./moderator/moderator/moderator.component";
import { ManageGroupComponent } from "./moderator/manage-group/manage-group.component";
import { ModeratorOverviewComponent } from "./moderator/moderator-overview/moderator-overview.component";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { AdminFacultyComponent } from "./admin/admin-faculty/admin-faculty.component";
import { ManageLessonsComponent } from "./admin/admin-dashboard/manage-lessons/manage-lessons.component";
import { ManageTeachersComponent } from "./admin/admin-dashboard/manage-teachers/manage-teachers.component";
import { ManageStudentsComponent } from "./admin/admin-dashboard/manage-students/manage-students.component";
import { ManageModeratorsComponent } from "./admin/admin-faculty/manage-moderators/manage-moderators.component";
import { ManageGroupsComponent } from "./admin/admin-faculty/manage-groups/manage-groups.component";
import { StudentComponent } from "./student/student/student.component";
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard]
  },
  {
    path: 'student',
    canActivate: [authGuard],
    children: [
      { path: 'schedule/:id', component: ScheduleComponent },
      {
        path: '',
        component: StudentComponent,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'moderator',
    canActivate: [authGuard],
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
    canActivate: [authGuard],
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
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
