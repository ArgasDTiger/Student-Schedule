import {Component, OnDestroy, OnInit} from '@angular/core';
import {Group} from "../../../core/models/group";
import {GroupService} from "../../../core/services/group.service";
import {ModalService} from "../../../core/services/modal.service";
import {Subscription} from "rxjs";
import {ToasterManagerService} from "../../../core/services/toaster-manager.service";
import {ItemListComponent} from "../../item-list/item-list.component";
import {EditGroupModalComponent} from "./edit-group-modal/edit-group-modal.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-manage-groups',
  standalone: true,
  imports: [
    ItemListComponent,
    EditGroupModalComponent
  ],
  templateUrl: './manage-groups.component.html',
  styleUrl: './manage-groups.component.scss'
})
export class ManageGroupsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private routeSubscription?: Subscription;

  groups: Group[] = [];
  facultyId?: number;

  actions = [
    { type: 'edit', label: 'Редагувати', class: 'btn-warning' },
    { type: 'delete', label: 'Видалити', class: 'btn-danger' }
  ];

  constructor(
    private groupService: GroupService,
    private modalService: ModalService,
    private toasterManagerService: ToasterManagerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.groupService.groupsRefresh$.subscribe(() => {
        this.loadGroups();
      })
    );

    this.routeSubscription = this.route.parent?.params.subscribe(params => {
      this.facultyId = +params['id'];
      this.loadGroups();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSearch(term: string) {
    this.loadGroups(term);
  }

  openCreateModal() {
    if (this.facultyId) {
      this.modalService.openCreateGroupModal(this.facultyId);
    }
  }

  openEditModal(group: Group) {
    this.modalService.openEditGroupModal(group);
  }

  async onAction(event: {type: string, item: Group}) {
    const { type, item } = event;

    switch (type) {
      case 'create':
        this.openCreateModal();
        break;
      case 'edit':
        this.openEditModal(item);
        break;
      case 'delete':
        try {
          const success = await this.groupService.deleteGroup(item.id);
          if (success) {
            this.groups = this.groups.filter(i => i.id !== item.id);
            this.toasterManagerService.success("Групу успішно видалено.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при видаленні групи.");
        }
        break;
    }
  }

  private loadGroups(search: string = '') {
    if (this.facultyId) {
      this.groupService.getGroups(this.facultyId, search).subscribe({
        next: groups => this.groups = groups,
        error: () => this.toasterManagerService.error("Помилка при завантаженні груп.")
      });
    }
  }
}
