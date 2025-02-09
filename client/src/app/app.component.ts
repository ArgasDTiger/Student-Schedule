import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./shared/sidebar/sidebar.component";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgClass} from "@angular/common";
import {ToasterManagerService} from "./core/services/toaster-manager.service";
import {AuthService} from "./core/services/auth.service";
import {UserService} from "./core/services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MatIconModule, MatSlideToggleModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private authSubscription?: Subscription;
  sidebarCollapsed: boolean = false;
  isAuthorized: boolean = false;

  constructor(private toasterManager: ToasterManagerService,
              private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
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
    this.sidebarCollapsed = isCollapsed;
  }
}
