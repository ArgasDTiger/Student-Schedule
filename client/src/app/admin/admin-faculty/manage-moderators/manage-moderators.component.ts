import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {User} from "../../../core/models/user";
import {UserService} from "../../../core/services/user.service";
import {ActivatedRoute} from "@angular/router";
import {ToasterManagerService} from "../../../core/services/toaster-manager.service";
import {ItemListComponent} from "../../item-list/item-list.component";

@Component({
  selector: 'app-manage-moderators',
  standalone: true,
  imports: [
    ItemListComponent
  ],
  templateUrl: './manage-moderators.component.html',
  styleUrl: './manage-moderators.component.scss'
})
export class ManageModeratorsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private facultyId: number = 1;

  moderators: User[] = [];
  availableUsers: User[] = [];

  moderatorActions = [
    { type: 'remove', label: 'Видалити', class: 'btn-danger' }
  ];

  availableUserActions = [
    { type: 'add', label: 'Додати', class: 'btn-primary' }
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toasterManagerService: ToasterManagerService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.route.parent?.params.subscribe(params => {
        this.facultyId = +params['id'];
        this.loadModerators();
        this.loadAvailableUsers();
      })
    );

    this.subscription.add(
      this.userService.moderatorsRefresh$.subscribe(() => {
        this.loadModerators();
        this.loadAvailableUsers();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onModeratorSearch(term: string) {
    this.loadModerators(term);
  }

  onAvailableUserSearch(term: string) {
    this.loadAvailableUsers(term);
  }

  async onAction(event: {type: string, item: User}) {
    const { type, item } = event;
    let success = false;

    switch (type) {
      case 'add':
        try {
          success = await this.userService.addModeratorToFaculty(item.id, this.facultyId);
          if (success) {
            this.loadModerators();
            this.loadAvailableUsers();
            this.toasterManagerService.success("Модератора успішно додано.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при додаванні модератора.");
        }
        break;
      case 'remove':
        try {
          success = await this.userService.removeModeratorFromFaculty(item.id, this.facultyId);
          if (success) {
            this.moderators = this.moderators.filter(i => i.id !== item.id);
            this.loadAvailableUsers();
            this.toasterManagerService.success("Модератора успішно видалено.");
          }
        } catch {
          this.toasterManagerService.error("Помилка при видаленні модератора.");
        }
        break;
    }
  }

  private loadModerators(search: string = '') {
    this.userService.getModerators(search, this.facultyId).subscribe({
      next: users => this.moderators = users,
      error: () => this.toasterManagerService.error("Помилка при завантаженні модераторів.")
    });
  }

  private loadAvailableUsers(search: string = '') {
    this.userService.getUsers(search).subscribe({
      next: users => {
        this.availableUsers = users.filter(user =>
          !this.moderators.some(mod => mod.id === user.id)
        );
      },
      error: () => this.toasterManagerService.error("Помилка при завантаженні користувачів.")
    });
  }
}
