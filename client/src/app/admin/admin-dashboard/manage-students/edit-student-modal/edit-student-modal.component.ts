import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../../../../core/models/user";
import {ModalService} from "../../../../core/services/modal.service";
import {UserService} from "../../../../core/services/user.service";
import {ToasterManagerService} from "../../../../core/services/toaster-manager.service";
import {ModalFormComponent} from "../../../../shared/modals/modal-form/modal-form.component";

@Component({
  selector: 'app-edit-student-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalFormComponent
  ],
  templateUrl: './edit-student-modal.component.html',
  styleUrl: './edit-student-modal.component.scss'
})
export class EditStudentModalComponent implements OnInit, OnDestroy {
  private modalSubscription?: Subscription;

  isModalVisible = false;
  isUpdate = false;
  userForm: FormGroup;
  currentStudent?: User;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private userService: UserService,
    private toasterManagerService: ToasterManagerService
  ) {
    this.userForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.modalSubscription = this.modalService.editStudentModal$.subscribe(modalData => {
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
    this.currentStudent = undefined;
    this.userForm.reset();
  }

  openEditModal(user: User) {
    this.isModalVisible = true;
    this.isUpdate = true;
    this.currentStudent = user;
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
    });
  }

  closeModal() {
    this.isModalVisible = false;
    this.userForm.reset();
    this.currentStudent = undefined;
  }

  async onSubmit() {
    if (!this.userForm.valid) {
      this.toasterManagerService.error("Перевірте правильність заповнення форми.");
      return;
    }

    const changedUser = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      middleName: this.userForm.get('middleName')?.value,
      email: this.userForm.get('email')?.value,
    }

    if (this.isUpdate && this.currentStudent) {
      const updatedUser: User = {
        ...this.currentStudent,
        ...changedUser
      };

      const success = await this.userService.updateStudent(updatedUser);

      if (success) {
        this.toasterManagerService.success("Користувача успішно оновлено.");
        this.closeModal();
      } else {
        this.toasterManagerService.error("Помилка при оновленні користувача.");
      }
    } else {
      this.userService.addStudent(changedUser as User).subscribe({
        next: () => {
          this.toasterManagerService.success("Користувача успішно створено.");
          this.closeModal();
        },
        error: () => {
          this.toasterManagerService.error("Помилка при створенні користувача.");
        }
      });
    }
  }
}
