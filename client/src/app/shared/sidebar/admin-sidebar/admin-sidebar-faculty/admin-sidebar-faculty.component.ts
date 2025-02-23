import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {Faculty} from "../../../../core/models/faculty";

@Component({
  selector: 'app-admin-sidebar-faculty',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule
  ],
  templateUrl: './admin-sidebar-faculty.component.html',
  styleUrl: './admin-sidebar-faculty.component.scss'
})
export class AdminSidebarFacultyComponent {
  @Input() faculty!: Faculty;
}
