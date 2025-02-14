import {Component, Input} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {ModalFormComponent} from "../../shared/modal-form/modal-form.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {Lesson} from "../../core/models/lesson";
import {LessonService} from "../../core/services/lesson.service";
import {Teacher} from "../../core/models/teacher";
import {TeacherService} from "../../core/services/teacher.service";
import {LessonType, lessonTypes} from "../../core/enums/lessonType";
import {LessonInfo} from "../../core/models/lessonInfo";
import {LessonNumber} from "../../core/enums/lessonNumber";
import {Group} from "../../core/models/group";

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
export class EditScheduleModalComponent {
  lessons$?: Observable<Lesson[]>;
  teachers$?: Observable<Teacher[]>;

  isModalVisible = false;
  scheduleForm: FormGroup;
  isUpdate = false;
  lessonInfo?: LessonInfo; // for edit
  lessonNumber?: number; // for add
  groupId?: number; // for add

  constructor(private fb: FormBuilder,
              private lessonService: LessonService,
              private teacherService: TeacherService) {
    this.scheduleForm = this.fb.group({
      lesson: ['', Validators.required],
      teacher: ['', Validators.required],
      type: ['', Validators.required],
      room: ['', Validators.required, Validators.pattern("[0-9]\d\d")],
      evenWeek: [''],
      oddWeek: [''],
    });

    this.lessons$ = this.lessonService.getLessons();
    this.teachers$ = this.teacherService.getTeachers();
  }

  openEditModal(lessonInfo?: LessonInfo) {
    this.isModalVisible = true;
    this.lessonInfo = lessonInfo;
  }

  openCreateModal(lessonNumber?: number, groupId?: number) {
    this.isModalVisible = true;
    this.lessonNumber = lessonNumber;
    this.groupId = groupId;
  }

  closeModal() {
    this.isModalVisible = false;
    this.scheduleForm.reset();
  }

  onSubmit() {
    if (this.scheduleForm.valid) {
      console.log('Schedule form submitted:', this.scheduleForm.value);
      this.closeModal();
    }
  }

  protected readonly lessonTypes = lessonTypes;
}
