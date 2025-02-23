import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Teacher} from "../../../core/models/teacher";
import {ModalService} from "../../../core/services/modal.service";
import {ToasterManagerService} from "../../../core/services/toaster-manager.service";
import {TeacherService} from "../../../core/services/teacher.service";
import {EditLessonModalComponent} from "../manage-lessons/edit-lesson-modal/edit-lesson-modal.component";
import {ItemListComponent} from "../item-list/item-list.component";
import {degreeToString} from "../../../core/mappings/degreeToString";
import {Degree} from "../../../core/enums/degree";
import {EditTeacherModalComponent} from "./edit-teacher-modal/edit-teacher-modal.component";

@Component({
  selector: 'app-manage-teachers',
  standalone: true,
  imports: [
    EditLessonModalComponent,
    ItemListComponent,
    EditTeacherModalComponent
  ],
  templateUrl: './manage-teachers.component.html',
  styleUrl: './manage-teachers.component.scss'
})
export class ManageTeachersComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  activeItems: Teacher[] = [];
  archivedItems: Teacher[] = [];

  activeActions = [
    { type: 'archive', label: 'Архівувати', class: 'btn-primary' },
    { type: 'edit', label: 'Редагувати', class: 'btn-warning' },
    { type: 'delete', label: 'Видалити', class: 'btn-danger' }
  ];

  archivedActions = [
    { type: 'publish', label: 'Відновити', class: 'btn-primary' },
    { type: 'edit', label: 'Редагувати', class: 'btn-warning' },
    { type: 'delete', label: 'Видалити', class: 'btn-danger' }
  ];

  constructor(
    private teacherService: TeacherService,
    private modalService: ModalService,
    private toasterManagerService: ToasterManagerService
  ) {}

  ngOnInit() {
    this.loadActiveItems();
    this.loadArchivedItems();

    this.subscription.add(
      this.teacherService.teachersRefresh$.subscribe(() => {
        this.loadActiveItems();
        this.loadArchivedItems();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onActiveSearch(term: string) {
    this.loadActiveItems(term);
  }

  onArchivedSearch(term: string) {
    this.loadArchivedItems(term);
  }

  openCreateModal() {
    this.modalService.openCreateTeacherModal();
  }

  openEditModal(teacher: Teacher) {
    this.modalService.openEditTeacherModal(teacher);
  }

  async onAction(event: {type: string, item: Teacher}) {
    const { type, item } = event;
    let success = false;

    switch (type) {
      case 'create':
        this.openCreateModal();
        break;
      case 'edit':
        this.openEditModal(item);
        break;

      case 'archive':
        try {
          success = await this.teacherService.archiveTeacher(item.id);
          if (success) {
            this.activeItems = this.activeItems.filter(i => i.id !== item.id);
            this.archivedItems = [...this.archivedItems, item].sort((a, b) =>
              a.lastName.localeCompare(b.lastName)
            );
            this.toasterManagerService.success("Викладача успішно архівовано.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при архівації викладача.");
        }
        break;

      case 'publish':
        try {
          success = await this.teacherService.publishTeacher(item.id);
          if (success) {
            this.archivedItems = this.archivedItems.filter(i => i.id !== item.id);
            this.activeItems = [...this.activeItems, item].sort((a, b) =>
              a.lastName.localeCompare(b.lastName)
            );
            this.toasterManagerService.success("Викладача успішно відновлено.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при відновленні викладача.");
        }
        break;

      case 'delete':
        try {
          success = await this.teacherService.deleteTeacher(item.id);
          if (success) {
            this.activeItems = this.activeItems.filter(i => i.id !== item.id);
            this.archivedItems = this.archivedItems.filter(i => i.id !== item.id);
            this.toasterManagerService.success("Викладача успішно видалено.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при видаленні викладача.");
        }
        break;
    }
  }

  getDegree(teacher: any) {
    return degreeToString[teacher.degree as Degree];
  }

  private loadActiveItems(search: string = '') {
    this.teacherService.getTeachers(search).subscribe({
      next: teachers => this.activeItems = teachers,
      error: () => this.toasterManagerService.error("Помилка при завантаженні викладачів.")
    });
  }

  private loadArchivedItems(search: string = '') {
    this.teacherService.getArchivedTeachers(search).subscribe({
      next: teachers => this.archivedItems = teachers,
      error: () => this.toasterManagerService.error("Помилка при завантаженні архівованих викладачів.")
    });
  }

  protected readonly Degree = Degree;
}
