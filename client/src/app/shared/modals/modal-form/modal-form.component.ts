import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {ActionButtonColor, ActionButtonType} from "../../../core/constants/modal-types";

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: 'modal-form.component.html',
  styleUrl: 'modal-form.component.scss'
})
export class ModalFormComponent {
  @Input() title: string = 'Підтвердіть дію';
  @Input() isVisible: boolean = false;
  @Input() submitDisabled: boolean = false;
  @Input() submitButtonText: ActionButtonType = 'Зберегти';
  @Input() submitButtonColor: ActionButtonColor = 'default';
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit();
  }

  get submitButtonClass(): string {
    return this.submitButtonColor === 'red' ? 'btn-danger' : 'btn-primary';
  }
}
