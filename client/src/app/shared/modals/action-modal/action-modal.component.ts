import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalService } from "../../../core/services/modal.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { ModalFormComponent } from "../modal-form/modal-form.component";
import {ActionButtonColor, ActionButtonType} from "../../../core/constants/modal-types";

@Component({
  selector: 'app-action-modal',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ModalFormComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './action-modal.component.html',
  styleUrl: './action-modal.component.scss'
})
export class ActionModalComponent implements OnInit, OnDestroy {
  private modalSubscription?: Subscription;
  isModalVisible = false;
  header?: string;
  message?: string;
  buttonText: ActionButtonType = 'Зберегти';
  buttonColor: ActionButtonColor = 'default';

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.modalSubscription = this.modalService.actionModal$.subscribe(data => {
      this.isModalVisible = true;
      this.header = data.header;
      this.message = data.message;
      this.buttonText = data.buttonText;
      this.buttonColor = data.buttonColor;
    });
  }

  ngOnDestroy() {
    this.modalSubscription?.unsubscribe();
  }

  closeModal() {
    this.isModalVisible = false;
    this.modalService.resolveActionModal(false);
  }

  onSubmit() {
    this.modalService.resolveActionModal(true);
    this.closeModal();
  }
}
