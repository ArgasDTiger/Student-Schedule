import {Component, OnDestroy, OnInit} from '@angular/core';
import {Lesson} from "../../../core/models/lesson";
import {LessonService} from "../../../core/services/lesson.service";
import {ItemListComponent} from "../item-list/item-list.component";
import {ModalService} from "../../../core/services/modal.service";
import {ToasterManagerService} from "../../../core/services/toaster-manager.service";
import {EditLessonModalComponent} from "./edit-lesson-modal/edit-lesson-modal.component";
import {Subscription} from "rxjs";
import {Degree} from "../../../core/enums/degree";
import {degreeToString} from "../../../core/mappings/degreeToString";

@Component({
  selector: 'app-manage-lessons',
  standalone: true,
  imports: [
    ItemListComponent,
    EditLessonModalComponent
  ],
  templateUrl: './manage-lessons.component.html',
  styleUrl: './manage-lessons.component.scss'
})
export class ManageLessonsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  activeItems: Lesson[] = [];
  archivedItems: Lesson[] = [];

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
    private lessonService: LessonService,
    private modalService: ModalService,
    private toasterManagerService: ToasterManagerService
  ) {}

  ngOnInit() {
    this.loadActiveItems();
    this.loadArchivedItems();

    this.subscription.add(
      this.lessonService.lessonsRefresh$.subscribe(() => {
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
    this.modalService.openCreateLessonModal();
  }

  openEditModal(lesson: Lesson) {
    this.modalService.openEditLessonModal(lesson);
  }

  async onAction(event: {type: string, item: Lesson}) {
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
          success = await this.lessonService.archiveLesson(item.id);
          if (success) {
            this.activeItems = this.activeItems.filter(i => i.id !== item.id);
            this.archivedItems = [...this.archivedItems, item].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            this.toasterManagerService.success("Предмет успішно архівовано.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при архівації предмету.");
        }
        break;

      case 'publish':
        try {
          success = await this.lessonService.publishLesson(item.id);
          if (success) {
            this.archivedItems = this.archivedItems.filter(i => i.id !== item.id);
            this.activeItems = [...this.activeItems, item].sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            this.toasterManagerService.success("Предмет успішно відновлено.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при відновленні предмету.");
        }
        break;

      case 'delete':
        try {
          success = await this.lessonService.deleteLesson(item.id);
          if (success) {
            this.activeItems = this.activeItems.filter(i => i.id !== item.id);
            this.archivedItems = this.archivedItems.filter(i => i.id !== item.id);
            this.toasterManagerService.success("Предмет успішно видалено.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при видаленні предмету.");
        }
        break;
    }
  }

  private loadActiveItems(search: string = '') {
    this.lessonService.getLessons(search).subscribe({
      next: lessons => this.activeItems = lessons,
      error: () => this.toasterManagerService.error("Помилка при завантаженні предметів.")
    });
  }

  private loadArchivedItems(search: string = '') {
    this.lessonService.getArchivedLessons(search).subscribe({
      next: lessons => this.archivedItems = lessons,
      error: () => this.toasterManagerService.error("Помилка при завантаженні архівованих предметів.")
    });
  }

  protected readonly Degree = Degree;
  protected readonly degreeToString = degreeToString;
}
