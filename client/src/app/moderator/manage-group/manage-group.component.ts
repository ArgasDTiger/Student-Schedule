import {Component, OnInit} from '@angular/core';
import {UserSearchListComponent} from "../../shared/user-search-list/user-search-list.component";
import {User} from "../../core/models/user";
import {UserService} from "../../core/services/user.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-manage-group',
  standalone: true,
  imports: [
    UserSearchListComponent
  ],
  templateUrl: './manage-group.component.html',
  styleUrl: './manage-group.component.scss'
})
export class ManageGroupComponent implements OnInit {
  groupUsers: User[] = [];
  availableUsers: User[] = [];
  groupId?: number;

  constructor(private userService: UserService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadGroupUsers();
    this.loadAvailableUsers();

    this.route.params.subscribe(params => {
      this.route.parent?.params.subscribe(parentParams => {
        this.groupId = +parentParams['id'];
        if (this.groupId) {
          this.loadGroupUsers();
          this.loadAvailableUsers();
          return;
        }
      });
    });
  }

  onGroupSearch(term: string) {
    this.userService.getStudentsByGroup(term, this.groupId)
      .subscribe(users => this.groupUsers = users);
  }

  onAvailableSearch(term: string) {
    this.userService.getStudentsOutsideGroup(term, this.groupId)
      .subscribe(users => this.availableUsers = users);
  }

  async addToGroup(user: User) {
    if (!this.groupId) return;
    const success = await this.userService.addUserToGroup(user.id, this.groupId);
    if (success) {
      this.groupUsers = [...this.groupUsers, user];
      this.groupUsers = this.groupUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));
      this.availableUsers = this.availableUsers.filter(u => u.id !== user.id);
    }
  }

  async removeFromGroup(user: User) {
    if (!this.groupId) return;
    const success = await this.userService.removeUserFromGroup(user.id, this.groupId);
    if (success) {
      this.availableUsers = [...this.availableUsers, user];
      this.availableUsers = this.availableUsers.sort((a, b) => a.lastName.localeCompare(b.lastName));
      this.groupUsers = this.groupUsers.filter(u => u.id !== user.id);
    }
  }

  private loadGroupUsers(search: string = '') {
    this.userService.getStudentsByGroup(search, this.groupId)
      .subscribe(users => this.groupUsers = users);
  }

  private loadAvailableUsers(search: string = '') {
    this.userService.getStudentsOutsideGroup(search, this.groupId)
      .subscribe(users => this.availableUsers = users);
  }
}
