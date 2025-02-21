import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../core/models/user";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-search-list',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './user-search-list.component.html',
  styleUrl: './user-search-list.component.scss'
})
export class UserSearchListComponent {
  @Input() title: string = '';
  @Input() placeholder: string = '';
  @Input() users: User[] = [];
  @Input() actionLabel: string = '';
  @Input() buttonClass: string = '';
  @Output() action = new EventEmitter<User>();
  @Output() search = new EventEmitter<string>();

  searchTerm: string = '';
  private searchSubject = new Subject<string | null>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.search.emit(term ?? '');
    });
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  getInitials(user: User) {
    return `${user.lastName[0]}${user.firstName[0]}`;
  }

  getFullName(user: User) {
    return `${user.lastName} ${user.firstName} ${user.middleName}`;
  }

  onAction(user: User) {
    this.action.emit(user);
  }
}
