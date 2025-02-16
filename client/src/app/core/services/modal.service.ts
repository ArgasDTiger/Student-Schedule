import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LessonInfo } from '../models/lessonInfo';
import { DayOfWeek } from "../enums/dayOfWeek";
import {ActionButtonColor, ActionButtonType} from "../constants/modal-types";

export interface ActionModalConfig {
  header: string;
  message: string;
  buttonText: ActionButtonType;
  buttonColor: ActionButtonColor;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private editModalSubject = new Subject<{type: 'create' | 'edit', data: any}>();
  private actionModalSubject = new Subject<ActionModalConfig>();
  private actionModalConfirmed?: (value: boolean) => void;

  editModal$ = this.editModalSubject.asObservable();
  actionModal$ = this.actionModalSubject.asObservable();

  openCreateLessonInfoModal(lessonNumber: number, groupId: number, weekDay: DayOfWeek) {
    this.editModalSubject.next({
      type: 'create',
      data: { lessonNumber, groupId, weekDay }
    });
  }

  openEditLessonInfoModal(lessonInfo: LessonInfo) {
    this.editModalSubject.next({
      type: 'edit',
      data: lessonInfo
    });
  }

  openActionModal(data: ActionModalConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.actionModalConfirmed = resolve;
      this.actionModalSubject.next(data);
    });
  }

  resolveActionModal(confirmed: boolean) {
    if (this.actionModalConfirmed) {
      this.actionModalConfirmed(confirmed);
      this.actionModalConfirmed = undefined;
    }
  }
}
