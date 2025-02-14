import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LessonNumber} from "../../core/enums/lessonNumber";
import {LessonInfo} from "../../core/models/lessonInfo";
import {lessonNumberToTimeSpanMap} from "../../core/mappings/lessonNumberToTimeSpan";
import {degreeToString} from "../../core/mappings/degreeToString";
import {lessonTypeToString} from "../../core/mappings/lessonTypeToString";
import {Observable, Subscription} from "rxjs";
import {UserService} from "../../core/services/user.service";
import {Role} from "../../core/enums/role";
import {MatIconModule} from "@angular/material/icon";
import {ModalFormComponent} from "../../shared/modal-form/modal-form.component";
import {ModalService} from "../../core/services/modal.service";
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {EditScheduleModalComponent} from "../../moderator/edit-schedule-modal/edit-schedule-modal.component";

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

  @ViewChild(EditScheduleModalComponent) editScheduleModalComponent?: EditScheduleModalComponent;

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

  openCreateModal() {
    this.editScheduleModalComponent?.openEditModal(this.lessonInfo);
  }

  openEditModal() {
    this.editScheduleModalComponent?.openCreateModal(this.emptyLessonNumber, this.groupId);
  }

  closeModal() {
    this.editScheduleModalComponent?.closeModal();
  }

  protected readonly Role = Role;
}
