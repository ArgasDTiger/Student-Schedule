import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Teacher} from "../../../../core/models/teacher";
import {ModalService} from "../../../../core/services/modal.service";
import {TeacherService} from "../../../../core/services/teacher.service";
import {ToasterManagerService} from "../../../../core/services/toaster-manager.service";
import {ModalFormComponent} from "../../../../shared/modals/modal-form/modal-form.component";
import {Degree} from "../../../../core/enums/degree";
import {degreeToString} from "../../../../core/mappings/degreeToString";

@Component({
  selector: 'app-edit-teacher-modal',
  standalone: true,
  imports: [
    ModalFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-teacher-modal.component.html',
  styleUrl: './edit-teacher-modal.component.scss'
})
export class EditTeacherModalComponent implements OnInit, OnDestroy {
  private modalSubscription?: Subscription;

  isModalVisible = false;
  isUpdate = false;
  teacherForm: FormGroup;
  currentTeacher?: Teacher;
  degrees = Object.entries(degreeToString).map(([key, value]) => ({
    key: key as Degree,
    value
  }));

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private teacherService: TeacherService,
    private toasterManagerService: ToasterManagerService
  ) {
    this.teacherForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      degree: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.modalSubscription = this.modalService.editTeacherModal$.subscribe(modalData => {
      if (modalData.type === 'create') {
        this.openCreateModal();
      } else {
        this.openEditModal(modalData.data);
      }
    });
  }

  ngOnDestroy() {
    this.modalSubscription?.unsubscribe();
  }

  openCreateModal() {
    this.isModalVisible = true;
    this.isUpdate = false;
    this.currentTeacher = undefined;
    this.teacherForm.reset();
  }

  openEditModal(teacher: Teacher) {
    this.isModalVisible = true;
    this.isUpdate = true;
    this.currentTeacher = teacher;
    this.teacherForm.patchValue({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      middleName: teacher.middleName,
      degree: teacher.degree,
    });
  }

  closeModal() {
    this.isModalVisible = false;
    this.teacherForm.reset();
    this.currentTeacher = undefined;
  }

  async onSubmit() {
    if (!this.teacherForm.valid) {
      this.toasterManagerService.error("Перевірте правильність заповнення форми.");
      return;
    }

    const changedTeacher = {
      firstName: this.teacherForm.get('firstName')?.value,
      lastName: this.teacherForm.get('lastName')?.value,
      middleName: this.teacherForm.get('middleName')?.value,
      degree: this.teacherForm.get('degree')?.value,
    }

    if (this.isUpdate && this.currentTeacher) {
      const updatedTeacher: Teacher = {
        ...this.currentTeacher,
        ...changedTeacher
      };

      const success = await this.teacherService.updateTeacher(updatedTeacher);

      if (success) {
        this.toasterManagerService.success("Викладача успішно оновлено.");
        this.closeModal();
      } else {
        this.toasterManagerService.error("Помилка при оновленні викладача.");
      }
    } else {
      this.teacherService.createTeacher(changedTeacher as Teacher).subscribe({
        next: () => {
          this.toasterManagerService.success("Викладача успішно створено.");
          this.closeModal();
        },
        error: () => {
          this.toasterManagerService.error("Помилка при створенні викладача.");
        }
      });
    }
  }
}
