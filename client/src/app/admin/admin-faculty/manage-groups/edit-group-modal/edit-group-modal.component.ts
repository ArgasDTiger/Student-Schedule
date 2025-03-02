import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GroupService} from "../../../../core/services/group.service";
import {ModalService} from "../../../../core/services/modal.service";
import {Group} from "../../../../core/models/group";
import {ToasterManagerService} from "../../../../core/services/toaster-manager.service";
import {Subscription} from "rxjs";
import {AddGroupInput} from "../../../../core/inputs/add-group-input";
import {ModalFormComponent} from "../../../../shared/modals/modal-form/modal-form.component";
import {UpdateGroupInput} from "../../../../core/inputs/update-group-input";

@Component({
  selector: 'app-edit-group-modal',
  standalone: true,
  imports: [
    ModalFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-group-modal.component.html',
  styleUrl: './edit-group-modal.component.scss'
})
export class EditGroupModalComponent implements OnInit, OnDestroy {
  private modalSubscription?: Subscription;

  isModalVisible = false;
  isUpdate = false;
  groupForm: FormGroup;
  currentGroup?: Group;
  facultyId?: number;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private groupService: GroupService,
    private toasterManagerService: ToasterManagerService
  ) {
    this.groupForm = this.fb.group({
      groupNumber: ['', [Validators.required, Validators.maxLength(6)]],
    });
  }

  ngOnInit() {
    this.modalSubscription = this.modalService.editGroupModal$.subscribe(modalData => {
      if (modalData.type === 'create') {
        this.facultyId = modalData.data;
        this.openCreateModal();
      } else {
        this.openEditModal(modalData.data as Group);
      }
    });
  }

  ngOnDestroy() {
    this.modalSubscription?.unsubscribe();
  }

  openCreateModal() {
    this.isModalVisible = true;
    this.isUpdate = false;
    this.currentGroup = undefined;
    this.groupForm.reset();
  }

  openEditModal(group: Group) {
    this.isModalVisible = true;
    this.isUpdate = true;
    this.currentGroup = group;
    this.groupForm.patchValue({
      groupNumber: group.groupNumber
    });
  }

  closeModal() {
    this.isModalVisible = false;
    this.groupForm.reset();
    this.currentGroup = undefined;
  }

  async onSubmit() {
    if (!this.groupForm.valid) {
      this.toasterManagerService.error("Перевірте правильність заповнення форми.");
      return;
    }

    const groupNumber = this.groupForm.get('groupNumber')?.value;

    if (this.isUpdate && this.currentGroup) {
      const updatedGroup: UpdateGroupInput = {
        id: this.currentGroup.id,
        facultyId: this.currentGroup.faculty.id,
        groupNumber: +groupNumber,
      };

      const success = await this.groupService.updateGroup(updatedGroup);

      if (success) {
        this.toasterManagerService.success("Групу успішно оновлено.");
        this.closeModal();
      } else {
        this.toasterManagerService.error("Помилка при оновленні групи.");
      }
    } else {
      const newGroup: AddGroupInput = {
        groupNumber: +groupNumber,
        facultyId: this.facultyId!
      };
      this.groupService.createGroup(newGroup).subscribe({
        next: () => {
          this.toasterManagerService.success("Групу успішно створено.");
          this.closeModal();
        },
        error: () => {
          this.toasterManagerService.error("Помилка при створенні групи.");
        }
      });
    }
  }
}
