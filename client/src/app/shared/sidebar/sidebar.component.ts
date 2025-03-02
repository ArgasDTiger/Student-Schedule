import {Component, Inject, OnDestroy, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {StudentSidebarComponent} from "./student-sidebar/student-sidebar.component";
import {isPlatformBrowser, NgClass, NgStyle} from "@angular/common";
import { EventEmitter } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Subscription} from "rxjs";
import {UserService} from "../../core/services/user.service";
import {Role} from "../../core/enums/role";
import {ModeratorSidebarComponent} from "./moderator-sidebar/moderator-sidebar.component";
import {AdminSidebarComponent} from "./admin-sidebar/admin-sidebar.component";
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {ToasterManagerService} from "../../core/services/toaster-manager.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatSlideToggleModule, StudentSidebarComponent, NgClass, NgStyle, ModeratorSidebarComponent, AdminSidebarComponent
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
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private toasterManagerService: ToasterManagerService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser)
      this.isSidebarCollapsed = JSON.parse(localStorage.getItem("sidebar_collapsed") ?? "false");

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

    if (this.isBrowser)
      localStorage.setItem("sidebar_collapsed", this.isSidebarCollapsed.toString());
  }

  async onLogout() {
    const success = await this.authService.revokeToken();
    if (success) {
      await this.router.navigate(['/login']);
      this.userService.currentUser$.next(null);
    } else {
      this.toasterManagerService.error("Помилка при виході з аканту.");
    }
  }

  protected readonly Role = Role;
}
