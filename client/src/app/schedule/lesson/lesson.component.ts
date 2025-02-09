import {Component, Input, OnInit} from '@angular/core';
import {LessonNumber, LessonNumberString} from "../../core/enums/lessonNumber";
import {LessonInfo} from "../../core/models/lessonInfo";
import {lessonNumberToTimeSpanMap} from "../../core/mappings/lessonNumberToTimeSpan";
import {degreeToString} from "../../core/mappings/degreeToString";
import {lessonTypeToString} from "../../core/mappings/lessonTypeToString";

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss'
})
export class LessonComponent {
  @Input() lessonInfo?: LessonInfo;

  protected readonly lessonNumberToTimeSpanMap = lessonNumberToTimeSpanMap;
  protected readonly degreeToString = degreeToString;
  protected readonly lessonTypeToString = lessonTypeToString;

  get lessonNumber(): number {
    if (!this.lessonInfo) return 0;
    return LessonNumber[this.lessonInfo.lessonNumber];
  }
}
