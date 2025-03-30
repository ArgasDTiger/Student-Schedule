import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-student',
  standalone: true,
    imports: [
        RouterOutlet
    ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {

}
