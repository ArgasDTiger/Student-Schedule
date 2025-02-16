import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalFormComponent } from "../../shared/modals/modal-form/modal-form.component";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import {catchError, Observable, of, Subscription} from "rxjs";
import { Lesson } from "../../core/models/lesson";
import { LessonService } from "../../core/services/lesson.service";
import { Teacher } from "../../core/models/teacher";
import { TeacherService } from "../../core/services/teacher.service";
import { lessonTypes } from "../../core/enums/lessonType";
import { LessonInfo } from "../../core/models/lessonInfo";
import {ModalService} from "../../core/services/modal.service";
import {ScheduleService} from "../../core/services/schedule.service";
import {AddLessonInfoInput} from "../../core/inputs/add-lesson-info-input";
import {DayOfWeek} from "../../core/enums/dayOfWeek";
import {convertLessonNumber, LessonNumber, LessonNumberString} from "../../core/enums/lessonNumber";
import {ToasterManagerService} from "../../core/services/toaster-manager.service";
import {map} from "rxjs/operators";
import {UpdateLessonInfoInput} from "../../core/inputs/update-lesson-info-input";

@Component({
  selector: 'app-edit-schedule-modal',
  standalone: true,
  templateUrl: './edit-schedule-modal.component.html',
  imports: [
    ReactiveFormsModule,
    ModalFormComponent,
    NgForOf,
    AsyncPipe,
    NgIf
  ],
  styleUrl: './edit-schedule-modal.component.scss'
})
export class EditScheduleModalComponent implements OnInit, OnDestroy {
  private modalSubscription?: Subscription;

  lessons$?: Observable<Lesson[]>;
  teachers$?: Observable<Teacher[]>;

  isModalVisible = false;
  scheduleForm!: FormGroup;
  isUpdate = false;
  lessonInfo?: LessonInfo; // for edit
  lessonNumber?: number; // for add
  groupId?: number; // for add
  weekDay?: DayOfWeek;

  constructor(private fb: FormBuilder,
              private lessonService: LessonService,
              private teacherService: TeacherService,
              private modalService: ModalService,
              private scheduleService: ScheduleService,
              private toasterManagerService: ToasterManagerService) {
    this.initForm();
    this.lessons$ = this.lessonService.getLessons();
    this.teachers$ = this.teacherService.getTeachers();
  }

  ngOnInit() {
    this.modalSubscription = this.modalService.editModal$.subscribe(modalData => {
      if (modalData.type === 'create') {
        this.openCreateModal(modalData.data.lessonNumber, modalData.data.groupId, modalData.data.weekDay);
      } else {
        this.openEditModal(modalData.data);
      }
    });
  }

  ngOnDestroy() {
    this.modalSubscription?.unsubscribe();
  }

  openEditModal(lessonInfo: LessonInfo) {
    this.isModalVisible = true;
    this.isUpdate = true;
    this.lessonInfo = lessonInfo;

    this.scheduleForm.patchValue({
      lesson: lessonInfo.lesson.id,
      teacher: lessonInfo.teacher.id,
      type: lessonInfo.type,
      room: lessonInfo.room,
      evenWeek: lessonInfo.evenWeek,
      oddWeek: lessonInfo.oddWeek
    });
  }

  openCreateModal(lessonNumber: number, groupId: number, weekDay: DayOfWeek) {
    this.isModalVisible = true;
    this.isUpdate = false;
    this.lessonNumber = lessonNumber;
    this.groupId = groupId;
    this.weekDay = weekDay;
    this.scheduleForm.reset({
      evenWeek: false,
      oddWeek: false
    });
  }

  closeModal() {
    this.isModalVisible = false;
    this.scheduleForm.reset({
      evenWeek: false,
      oddWeek: false
    });
    this.lessonInfo = undefined;
  }

   async onSubmit() {
    if (!this.scheduleForm.valid) {
      this.toasterManagerService.error("Перевірте заповнені поля перед збереженням розкладу.");
      return;
    }

    if (this.isUpdate && this.lessonInfo) {
      const success = await this.updateScheduleItem();

      if (success) {
        this.toasterManagerService.success("Розклад успішно оновлено.");
        this.closeModal();
      } else {
        this.toasterManagerService.error("Помилка при оновленні розкладу.");
      }
    }

    if (!this.isUpdate && this.groupId && this.weekDay && this.lessonNumber) {
      this.addScheduleItem().subscribe({
        next: () => {
          this.toasterManagerService.success("Предмет успішно додано.");
          this.closeModal();
        },
        error: () => {
          this.toasterManagerService.error("Помилка при додаванні предмету до розкладу.");
        }
      });
    }
  }


  private weekValidator(group: FormGroup) {
    const evenWeek = group.get('evenWeek')?.value;
    const oddWeek = group.get('oddWeek')?.value;

    return evenWeek || oddWeek ? null : { weekRequired: true };
  }

  private initForm() {
    this.scheduleForm = this.fb.group({
      lesson: ['', Validators.required],
      teacher: ['', Validators.required],
      type: ['', Validators.required],
      room: ['', [
        Validators.required,
        Validators.pattern(/^\d{1,3}$/)
      ]],
      evenWeek: [false],
      oddWeek: [false]
    }, {
      validators: this.weekValidator
    });
  }

  private addScheduleItem(): Observable<boolean> {
    const lessonInfo: AddLessonInfoInput = {
      lessonId: this.scheduleForm.controls['lesson'].value,
      groupId: this.groupId!,
      teacherId: this.scheduleForm.controls['teacher'].value,
      weekDay: this.weekDay!,
      lessonNumber: convertLessonNumber(this.lessonNumber!) as LessonNumberString,
      type: this.scheduleForm.controls['type'].value.toString(),
      room: +this.scheduleForm.controls['room'].value,
      oddWeek: this.scheduleForm.controls['oddWeek'].value,
      evenWeek: this.scheduleForm.controls['evenWeek'].value,
    };

    return this.scheduleService.createScheduleItem(lessonInfo).pipe(
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );
  }

  private async updateScheduleItem() {
    const lessonInfo: UpdateLessonInfoInput = {
      id: this.lessonInfo!.id,
      lessonId: this.scheduleForm.controls['lesson'].value,
      groupId: this.lessonInfo?.group.id!,
      teacherId: this.scheduleForm.controls['teacher'].value,
      weekDay: this.lessonInfo!.weekDay,
      lessonNumber: this.lessonInfo!.lessonNumber,
      type: this.scheduleForm.controls['type'].value.toString(),
      room: +this.scheduleForm.controls['room'].value,
      oddWeek: this.scheduleForm.controls['oddWeek'].value,
      evenWeek: this.scheduleForm.controls['evenWeek'].value,
    };

    return await this.scheduleService.updateScheduleItem(lessonInfo);
  }

  protected readonly lessonTypes = lessonTypes;
}
