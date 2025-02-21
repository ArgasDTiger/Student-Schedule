import {Component, OnInit} from '@angular/core';
import {UserSearchListComponent} from "../../shared/user-search-list/user-search-list.component";
import {User} from "../../core/models/user";
import {UserService} from "../../core/services/user.service";

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
  readonly groupId = 2;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadGroupUsers();
    this.loadAvailableUsers();
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
    const success = await this.userService.addUserToGroup(user.id, this.groupId);
    if (success) {
      this.groupUsers = [...this.groupUsers, user];
      this.availableUsers = this.availableUsers.filter(u => u.id !== user.id);
    }
  }

  async removeFromGroup(user: User) {
    const success = await this.userService.removeUserFromGroup(user.id, this.groupId);
    if (success) {
      this.availableUsers = [...this.availableUsers, user];
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
