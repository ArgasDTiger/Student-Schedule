import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {UserService} from "../../../core/services/user.service";
import {Faculty} from "../../../core/models/faculty";
import {MatIconModule} from "@angular/material/icon";
import {ModeratorSidebarFacultyComponent} from "./moderator-sidebar-faculty/moderator-sidebar-faculty.component";

@Component({
  selector: 'app-moderator-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    ModeratorSidebarFacultyComponent
  ],
  templateUrl: './moderator-sidebar.component.html',
  styleUrl: './moderator-sidebar.component.scss'
})
export class ModeratorSidebarComponent implements OnInit, OnDestroy {
  private currentUserSubscription?: Subscription;
  userFaculties: Faculty[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.currentUserSubscription = this.userService.currentUser$.subscribe(
      user => {
        this.userFaculties = user?.faculties ?? [];
      }
    )
  }

  ngOnDestroy() {
    this.currentUserSubscription?.unsubscribe();
  }
}
