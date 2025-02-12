import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LessonNumber} from "../../core/enums/lessonNumber";
import {LessonInfo} from "../../core/models/lessonInfo";
import {lessonNumberToTimeSpanMap} from "../../core/mappings/lessonNumberToTimeSpan";
import {degreeToString} from "../../core/mappings/degreeToString";
import {lessonTypeToString} from "../../core/mappings/lessonTypeToString";
import {Subscription} from "rxjs";
import {UserService} from "../../core/services/user.service";
import {Role} from "../../core/enums/role";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss'
})
export class LessonComponent implements OnInit, OnDestroy {
  @Input() lessonInfo?: LessonInfo;
  @Input() emptyLessonNumber?: number; // for mods only

  private userSubscription?: Subscription;
  protected readonly lessonNumberToTimeSpanMap = lessonNumberToTimeSpanMap;
  protected readonly degreeToString = degreeToString;
  protected readonly lessonTypeToString = lessonTypeToString;

  userRole?: Role;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.userRole = user?.role;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  get lessonNumber(): number {
    if (!this.lessonInfo) return 0;
    return LessonNumber[this.lessonInfo.lessonNumber];
  }

  protected readonly Role = Role;
}
