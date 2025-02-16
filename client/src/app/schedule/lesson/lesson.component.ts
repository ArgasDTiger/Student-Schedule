import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LessonNumber} from "../../core/enums/lessonNumber";
import {LessonInfo} from "../../core/models/lessonInfo";
import {lessonNumberToTimeSpanMap} from "../../core/mappings/lessonNumberToTimeSpan";
import {degreeToString} from "../../core/mappings/degreeToString";
import {lessonTypeToString} from "../../core/mappings/lessonTypeToString";
import {Subscription} from "rxjs";
import {UserService} from "../../core/services/user.service";
import {Role} from "../../core/enums/role";
import {MatIconModule} from "@angular/material/icon";
import {ModalFormComponent} from "../../shared/modal-form/modal-form.component";
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {EditScheduleModalComponent} from "../../moderator/edit-schedule-modal/edit-schedule-modal.component";
import {ScheduleModalService} from "../../core/services/schedule-modal.service";
import {DayOfWeek} from "../../core/enums/dayOfWeek";

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [
    MatIconModule,
    ModalFormComponent,
    AsyncPipe,
    ReactiveFormsModule,
    EditScheduleModalComponent
  ],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss'
})
export class LessonComponent implements OnInit, OnDestroy {
  @Input() lessonInfo?: LessonInfo;
  @Input() emptyLessonNumber?: number; // for mods only
  @Input() groupId?: number;
  @Input() weekDay?: DayOfWeek;

  @ViewChild(EditScheduleModalComponent) editScheduleModalComponent?: EditScheduleModalComponent;

  private userSubscription?: Subscription;
  protected readonly lessonNumberToTimeSpanMap = lessonNumberToTimeSpanMap;
  protected readonly degreeToString = degreeToString;
  protected readonly lessonTypeToString = lessonTypeToString;

  userRole?: Role;

  constructor(private userService: UserService,
              private scheduleModalService: ScheduleModalService) {
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

  openCreateModal() {
    console.log(`weekDay is ${this.weekDay}`)
    if (this.emptyLessonNumber && this.groupId && this.weekDay) {
      this.scheduleModalService.openCreateModal(this.emptyLessonNumber, this.groupId, this.weekDay);
    }
  }

  openEditModal() {
    if (this.lessonInfo) {
      this.scheduleModalService.openEditModal(this.lessonInfo);
    }
  }

  protected readonly Role = Role;
}
