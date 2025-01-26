import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./shared/sidebar/sidebar.component";
import {MatIconModule} from "@angular/material/icon";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgClass} from "@angular/common";
import {ToasterManagerService} from "./core/services/toaster-manager.service";
import {AuthService} from "./core/services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, MatIconModule, MatSlideToggleModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  sidebarCollapsed: boolean = false;
  isAuthorized: boolean = false;

  constructor(private toasterManager: ToasterManagerService, private authService: AuthService) {
    this.isAuthorized = this.authService.isAuthorized();
  }

  onSidebarToggle(isCollapsed: boolean) {
    this.sidebarCollapsed = isCollapsed;
  }
}
