import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalFormComponent} from "../../../../shared/modals/modal-form/modal-form.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalService} from "../../../../core/services/modal.service";
import {LessonService} from "../../../../core/services/lesson.service";
import {ToasterManagerService} from "../../../../core/services/toaster-manager.service";
import {Lesson} from "../../../../core/models/lesson";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-lesson-modal',
  standalone: true,
  imports: [
    ModalFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-lesson-modal.component.html',
  styleUrl: './edit-lesson-modal.component.scss'
})
export class EditLessonModalComponent implements OnInit, OnDestroy {
  private modalSubscription?: Subscription;

  isModalVisible = false;
  isUpdate = false;
  lessonForm: FormGroup;
  currentLesson?: Lesson;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private lessonService: LessonService,
    private toasterManagerService: ToasterManagerService
  ) {
    this.lessonForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.modalSubscription = this.modalService.editLessonModal$.subscribe(modalData => {
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
    this.currentLesson = undefined;
    this.lessonForm.reset();
  }

  openEditModal(lesson: Lesson) {
    this.isModalVisible = true;
    this.isUpdate = true;
    this.currentLesson = lesson;
    this.lessonForm.patchValue({
      name: lesson.name
    });
  }

  closeModal() {
    this.isModalVisible = false;
    this.lessonForm.reset();
    this.currentLesson = undefined;
  }

  async onSubmit() {
    if (!this.lessonForm.valid) {
      this.toasterManagerService.error("Перевірте правильність заповнення форми.");
      return;
    }

    const name = this.lessonForm.get('name')?.value;

    if (this.isUpdate && this.currentLesson) {
      const updatedLesson: Lesson = {
        ...this.currentLesson,
        name
      };

      const success = await this.lessonService.updateLesson(updatedLesson);

      if (success) {
        this.toasterManagerService.success("Предмет успішно оновлено.");
        this.closeModal();
      } else {
        this.toasterManagerService.error("Помилка при оновленні предмету.");
      }
    } else {
      this.lessonService.createLesson(name).subscribe({
        next: () => {
          this.toasterManagerService.success("Предмет успішно створено.");
          this.closeModal();
        },
        error: () => {
          this.toasterManagerService.error("Помилка при створенні предмету.");
        }
      });
    }
  }
}
