import { Component, OnInit } from '@angular/core';
import { ScheduleService } from "../../core/services/schedule.service";
import { LessonInfo } from "../../core/models/lessonInfo";
import {LessonComponent} from "./lesson/lesson.component";
import {LessonNumber} from "../../core/enums/lessonNumber";
import {DayOfWeek} from "../../core/enums/dayOfWeek";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    LessonComponent,
    NgForOf
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  lessons: LessonInfo[] = [];
  maxLessonNumber: number = 5;
  lessonNumbers: number[] = [];
  daysOfWeek = Object.values(DayOfWeek).slice(0, 5);

  constructor(private scheduleService: ScheduleService) {
  }

  ngOnInit() {
    this.scheduleService.getScheduleByGroupId(1).subscribe({
      next: (lessons: LessonInfo[]) => {
        this.lessons = lessons;
        const maxLessonNumberString = this.lessons.slice().sort((a, b) => LessonNumber[b.lessonNumber] - LessonNumber[a.lessonNumber])[0].lessonNumber;
        this.maxLessonNumber = LessonNumber[maxLessonNumberString];
        this.lessonNumbers = Array.from({ length: this.maxLessonNumber }, (_, i) => i + 1);
      },
      error: (e) => {
        console.error(e);
      }
    }
    );
  }

  getLesson(lessonNumber: number, day: string) {
    return this.lessons.find(lesson => lesson.lessonNumber === LessonNumber[lessonNumber] && lesson.weekDay === day);
  }

}
