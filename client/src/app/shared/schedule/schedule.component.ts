import { Component, OnInit } from '@angular/core';
import { ScheduleService } from "../../core/services/schedule.service";
import { LessonInfo } from "../../core/models/lessonInfo";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  lessons: LessonInfo[] = [];

  constructor(private scheduleService: ScheduleService) {
  }

  ngOnInit() {
    this.scheduleService.getScheduleByGroupId(1).subscribe(
      (lessons: LessonInfo[]) => {
        this.lessons = lessons;
        console.log("lessons: ", this.lessons);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
