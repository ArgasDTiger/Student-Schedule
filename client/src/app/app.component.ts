import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {SidebarComponent} from "./shared/sidebar/sidebar.component";
import {isPlatformBrowser, NgClass, NgIf} from "@angular/common";
import {ToasterManagerService} from "./core/services/toaster-manager.service";
import {AuthService} from "./core/services/auth.service";
import {UserService} from "./core/services/user.service";
import {combineLatest, Subscription} from "rxjs";
import {ActionModalComponent} from "./shared/modals/action-modal/action-modal.component";
import {LoadingSpinnerComponent} from "./shared/spinner/spinner.component";
import {LoadingService} from "./core/services/loading.service";
import {filter, map} from "rxjs/operators";

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
  private routerSubscription?: Subscription;

  isSidebarCollapsed: boolean = false;
  isAuthorized: boolean = false;
  isLoading: boolean = true;
  isBrowser = false;

  constructor(
    private toasterManager: ToasterManagerService,
    private authService: AuthService,
    private userService: UserService,
    private loadingService: LoadingService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.isSidebarCollapsed = JSON.parse(localStorage.getItem("sidebar_collapsed") ?? "false");

      // Initialize the authentication check
      // This ensures we have a user check on app startup, even if routes don't use the guard
      if (!this.userService.isInitialized) {
        this.userService.setCurrentUser().subscribe();
      }
    }

    // Combine loading states from both services
    this.loadingSubscription = combineLatest([
      this.authService.isLoading$,
      this.loadingService.loading$
    ]).pipe(
      map(([authLoading, appLoading]) => authLoading || appLoading)
    ).subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    this.authSubscription = this.authService.isAuthorized().subscribe({
      next: (isAuth) => {
        this.isAuthorized = isAuth;
      },
      error: () => {
        this.isAuthorized = false;
        this.authService.setLoading(false);
      },
    });

    // Handle router events for loading states
    this.routerSubscription = this.router.events.pipe(
      filter(event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        // Only set loading if we're not already loading
        if (!this.isLoading) {
          this.loadingService.setLoading(true);
        }
      } else {
        // NavigationEnd, NavigationCancel, NavigationError
        this.loadingService.setLoading(false);
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.loadingSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  onSidebarToggle(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
    if (this.isBrowser) {
      localStorage.setItem("sidebar_collapsed", JSON.stringify(isCollapsed));
    }
  }
}
