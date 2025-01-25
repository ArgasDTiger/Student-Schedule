import {Component, Input, OnInit} from '@angular/core';
import {LessonNumber, LessonNumberString} from "../../../core/enums/lessonNumber";
import {LessonInfo} from "../../../core/models/lessonInfo";
import {lessonNumberToTimeSpanMap} from "../../../core/mappings/lessonNumberToTimeSpan";
import {degreeToString} from "../../../core/mappings/degreeToString";
import {lessonTypeToString} from "../../../core/mappings/lessonTypeToString";

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss'
})
export class LessonComponent implements OnInit {
  @Input() lessonInfo?: LessonInfo;

  lessonNumber: number = 1;

  protected readonly lessonNumberToTimeSpanMap = lessonNumberToTimeSpanMap;
  protected readonly degreeToString = degreeToString;
  protected readonly lessonTypeToString = lessonTypeToString;

  ngOnInit(): void {
    let lessonNumberString = this.lessonInfo?.lessonNumber as unknown as string;
    this.lessonNumber = LessonNumber[lessonNumberString as unknown as keyof typeof LessonNumberString];
  }

}
