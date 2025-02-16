import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LessonInfo } from '../models/lessonInfo';
import {DayOfWeek} from "../enums/dayOfWeek";

@Injectable({
  providedIn: 'root'
})
export class ScheduleModalService {
  private editModalSubject = new Subject<{type: 'create' | 'edit', data: any}>();
  editModal$ = this.editModalSubject.asObservable();

  openCreateModal(lessonNumber: number, groupId: number, weekDay: DayOfWeek) {
    console.log("calling modal")
    this.editModalSubject.next({
      type: 'create',
      data: { lessonNumber, groupId, weekDay }
    });
  }

  openEditModal(lessonInfo: LessonInfo) {
    this.editModalSubject.next({
      type: 'edit',
      data: lessonInfo
    });
  }
}
