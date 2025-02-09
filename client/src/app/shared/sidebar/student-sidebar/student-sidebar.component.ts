import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {UserService} from "../../../core/services/user.service";
import {pipe, Subscription, tap} from "rxjs";
import {Group} from "../../../core/models/group";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-student-sidebar',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './student-sidebar.component.html',
  styleUrl: './student-sidebar.component.scss'
})
export class StudentSidebarComponent implements OnInit, OnDestroy {
  private currentUserSubscription?: Subscription;
  userGroups: Group[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.currentUserSubscription = this.userService.currentUser$.subscribe(
      user => {
        this.userGroups = user?.groups ?? [];
      }
    )
  }

  ngOnDestroy() {
    this.currentUserSubscription?.unsubscribe();
  }
}
