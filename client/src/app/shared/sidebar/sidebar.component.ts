import {Component, OnDestroy, OnInit, Output} from '@angular/core';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {StudentSidebarComponent} from "./student-sidebar/student-sidebar.component";
import {NgClass, NgStyle} from "@angular/common";
import { EventEmitter } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subscription} from "rxjs";
import {UserService} from "../../core/services/user.service";
import {Role} from "../../core/enums/role";
import {ModeratorSidebarComponent} from "./moderator-sidebar/moderator-sidebar.component";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatSlideToggleModule, StudentSidebarComponent, NgClass, NgStyle, ModeratorSidebarComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.3s ease', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private currentUserSubscription?: Subscription;
  @Output() sidebarCollapsed = new EventEmitter<boolean>();

  isSidebarCollapsed = false;
  userRole?: Role;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.currentUserSubscription = this.userService.currentUser$.subscribe(
      user => {
        this.userRole = user?.role;
      }
    )
  }

  ngOnDestroy() {
    this.currentUserSubscription?.unsubscribe();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.sidebarCollapsed.emit(this.isSidebarCollapsed);
  }

  protected readonly Role = Role;
}
