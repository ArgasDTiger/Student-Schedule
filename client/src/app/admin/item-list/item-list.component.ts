import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {FormsModule} from "@angular/forms";
import {NgTemplateOutlet} from "@angular/common";

export interface BaseItem {
  id: number;
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent<T extends BaseItem> {
  @Input() title: string = '';
  @Input() placeholder: string = '';
  @Input() items: T[] = [];
  @Input() actions: Array<{ type: string; label: string; class: string; }> = [];
  @Input() showAddButton: boolean = false;
  @Input() addButtonLabel: string = 'Додати';
  @Input() addButtonClass: string = 'btn-primary';
  @Input() itemTemplate?: TemplateRef<{ $implicit: T }>;

  @Output() action = new EventEmitter<{type: string, item: T}>();
  @Output() search = new EventEmitter<string>();
  @Output() add = new EventEmitter<void>();

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.search.emit(term);
    });
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  onAction(type: string, item: T) {
    this.action.emit({ type, item });
  }

  onAdd() {
    this.add.emit();
  }
}
