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
import {ModalFormComponent} from "../../shared/modals/modal-form/modal-form.component";
import {AsyncPipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {EditScheduleModalComponent} from "../../moderator/edit-schedule-modal/edit-schedule-modal.component";
import {ModalService} from "../../core/services/modal.service";
import {DayOfWeek} from "../../core/enums/dayOfWeek";
import {ScheduleService} from "../../core/services/schedule.service";
import {ToasterManagerService} from "../../core/services/toaster-manager.service";

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
              private scheduleModalService: ModalService,
              private scheduleService: ScheduleService,
              private toasterManagerService: ToasterManagerService,
              private modalService: ModalService) {
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
    if (this.emptyLessonNumber && this.groupId && this.weekDay) {
      this.scheduleModalService.openCreateLessonInfoModal(this.emptyLessonNumber, this.groupId, this.weekDay);
    }
  }

  openEditModal() {
    if (this.lessonInfo) {
      this.scheduleModalService.openEditLessonInfoModal(this.lessonInfo);
    }
  }

  async deleteScheduleItem() {
    if (!this.lessonInfo) return;

    const confirmed = await this.modalService.openActionModal({
      header: 'Видалення предмету',
      message: 'Ви впевнені, що хочете видалити цей предмет з розкладу?',
      buttonText: 'Видалити',
      buttonColor: 'red'
    });

    if (!confirmed) {
      return;
    }

    const success = await this.scheduleService.deleteScheduleItem(this.lessonInfo.id, this.lessonInfo.group.id);

    if (success) {
      this.toasterManagerService.success("Успішно видалено предмет розкладу.");
      this.lessonInfo = undefined;
    } else {
      this.toasterManagerService.error("Помилка при видаленні предмету з розкладу.");
    }
  }

  protected readonly Role = Role;
}
