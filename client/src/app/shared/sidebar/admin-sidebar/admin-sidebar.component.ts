import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {AdminSidebarFacultyComponent} from "./admin-sidebar-faculty/admin-sidebar-faculty.component";
import {Subscription} from "rxjs";
import {UserService} from "../../../core/services/user.service";
import {Faculty} from "../../../core/models/faculty";

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    RouterLinkActive,
    AdminSidebarFacultyComponent
  ],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;
  faculties: Faculty[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.subscription = this.userService.currentUser$.subscribe(
      user => {
        this.faculties = user?.faculties ?? [];
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
