import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./shared/sidebar/sidebar.component";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {isPlatformBrowser, NgClass, NgIf} from "@angular/common";
import {ToasterManagerService} from "./core/services/toaster-manager.service";
import {AuthService} from "./core/services/auth.service";
import {UserService} from "./core/services/user.service";
import {Subscription} from "rxjs";
import {ActionModalComponent} from "./shared/modals/action-modal/action-modal.component";
import {LoadingSpinnerComponent} from "./shared/spinner/spinner.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    ActionModalComponent,
    NgClass,
    NgIf,
    RouterOutlet,
    SidebarComponent
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription?: Subscription;
  private loadingSubscription?: Subscription;
  isSidebarCollapsed: boolean = false;
  isAuthorized: boolean = false;
  isLoading: boolean = true;
  isBrowser = false;

  constructor(
    private toasterManager: ToasterManagerService,
    private authService: AuthService,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.isSidebarCollapsed = JSON.parse(localStorage.getItem("sidebar_collapsed") ?? "false");

      // Initialize auth flow by setting current user
      // This will also trigger loading states
      this.userService.setCurrentUser();
    }

    // Subscribe to loading state
    this.loadingSubscription = this.authService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    // Subscribe to auth state
    this.authSubscription = this.authService.isAuthorized().subscribe({
      next: (isAuth) => {
        this.isAuthorized = isAuth;
      },
      error: () => {
        this.isAuthorized = false;
        this.authService.setLoading(false);
      },
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.loadingSubscription?.unsubscribe();
  }

  onSidebarToggle(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
    if (this.isBrowser) {
      localStorage.setItem("sidebar_collapsed", JSON.stringify(isCollapsed));
    }
  }
}
