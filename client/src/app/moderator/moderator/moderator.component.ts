import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-moderator',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'moderator.component.html',
  styleUrls: ['./moderator.component.scss']
})
export class ModeratorComponent {

}
