import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {User} from "../../../core/models/user";
import {UserService} from "../../../core/services/user.service";
import {ModalService} from "../../../core/services/modal.service";
import {ToasterManagerService} from "../../../core/services/toaster-manager.service";
import {ItemListComponent} from "../../item-list/item-list.component";
import {EditStudentModalComponent} from "./edit-student-modal/edit-student-modal.component";

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [
    ItemListComponent,
    EditStudentModalComponent
  ],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.scss'
})
export class ManageStudentsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  activeItems: User[] = [];

  activeActions = [
    { type: 'edit', label: 'Редагувати', class: 'btn-warning' },
    { type: 'delete', label: 'Видалити', class: 'btn-danger' }
  ];

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private toasterManagerService: ToasterManagerService
  ) {}

  ngOnInit() {
    this.loadActiveItems();

    this.subscription.add(
      this.userService.studentsRefresh$.subscribe(() => {
        this.loadActiveItems();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onActiveSearch(term: string) {
    this.loadActiveItems(term);
  }

  openCreateModal() {
    this.modalService.openCreateStudentModal();
  }

  openEditModal(user: User) {
    this.modalService.openEditStudentModal(user);
  }

  async onAction(event: {type: string, item: User}) {
    const { type, item } = event;
    let success = false;

    switch (type) {
      case 'create':
        this.openCreateModal();
        break;
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        try {
          success = await this.userService.removeStudent(item.id);
          if (success) {
            this.activeItems = this.activeItems.filter(i => i.id !== item.id);
            this.toasterManagerService.success("Користувача успішно видалено.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при видаленні користувача.");
        }
        break;
    }
  }

  private loadActiveItems(search: string = '') {
    this.userService.getStudents(search).subscribe({
      next: users => this.activeItems = users,
      error: () => this.toasterManagerService.error("Помилка при завантаженні користувачів.")
    });
  }
}
