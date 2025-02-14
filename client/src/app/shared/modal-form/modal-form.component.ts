import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: 'modal-form.component.html',
  styleUrl: 'modal-form.component.scss'
})
export class ModalFormComponent {
  @Input() title: string = 'Modal Form';
  @Input() isVisible: boolean = false;
  @Input() submitDisabled: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit();
  }
}
