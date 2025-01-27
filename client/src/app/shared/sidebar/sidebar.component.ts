import {Component, Output} from '@angular/core';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatIconModule} from "@angular/material/icon";
import {StudentSidebarComponent} from "./student-sidebar/student-sidebar.component";
import {NgClass, NgStyle} from "@angular/common";
import { EventEmitter } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, MatSlideToggleModule, StudentSidebarComponent, NgClass, NgStyle
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
        animate('0.3s ease', style({ opacity: 0 })), // Fade out
      ]),
    ]),
  ],
})
export class SidebarComponent {
  @Output() sidebarCollapsed = new EventEmitter<boolean>();

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.sidebarCollapsed.emit(this.isSidebarCollapsed);
  }
}
