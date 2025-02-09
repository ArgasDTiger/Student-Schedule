// moderator-sidebar-faculty.component.ts
import { Component, Input } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { Faculty } from "../../../../core/models/faculty";
import { CommonModule } from "@angular/common";
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-moderator-sidebar-faculty',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './moderator-sidebar-faculty.component.html',
  styleUrl: './moderator-sidebar-faculty.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('collapsed <=> expanded', [
        animate('200ms ease-in-out')
      ])
    ]),
    trigger('rotateIcon', [
      state('collapsed', style({ transform: 'rotate(0)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('collapsed <=> expanded', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class ModeratorSidebarFacultyComponent {
  @Input() faculty!: Faculty;
  groupsVisible = false;

  toggleGroups() {
    this.groupsVisible = !this.groupsVisible;
  }
}
