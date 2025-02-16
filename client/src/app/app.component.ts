import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./shared/sidebar/sidebar.component";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {isPlatformBrowser, NgClass} from "@angular/common";
import {ToasterManagerService} from "./core/services/toaster-manager.service";
import {AuthService} from "./core/services/auth.service";
import {UserService} from "./core/services/user.service";
import {Subscription} from "rxjs";
import {ActionModalComponent} from "./shared/modals/action-modal/action-modal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MatIconModule, MatSlideToggleModule, NgClass, ActionModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription?: Subscription;
  isSidebarCollapsed: boolean = false;
  isAuthorized: boolean = false;
  isBrowser = false;

  constructor(private toasterManager: ToasterManagerService,
              private authService: AuthService,
              private userService: UserService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser)
      this.isSidebarCollapsed = JSON.parse(localStorage.getItem("sidebar_collapsed") ?? "false");

    this.userService.setCurrentUser();
    this.authSubscription = this.authService.isAuthorized().subscribe({
      next: (user) => {
        this.isAuthorized = user;
      },
      error: () => {
        this.isAuthorized = false;
      },
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  onSidebarToggle(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
