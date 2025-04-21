import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LessonInfo } from '../models/lessonInfo';
import { DayOfWeek } from "../enums/dayOfWeek";
import {ActionButtonColor, ActionButtonType} from "../constants/modal-types";
import {Lesson} from "../models/lesson";
import {Teacher} from "../models/teacher";
import {User} from "../models/user";
import {Group} from "../models/group";

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
  private editLessonInfoModalSubject = new Subject<{type: 'create' | 'edit', data: any}>();
  private editLessonModalSubject = new Subject<{type: 'create' | 'edit', data?: any}>();
  private editTeacherModalSubject = new Subject<{type: 'create' | 'edit', data?: any}>();
  private editStudentModalSubject = new Subject<{type: 'create' | 'edit', data?: any}>();
  private editGroupModalSubject = new Subject<{type: 'create' | 'edit', data?: any}>();
  private actionModalSubject = new Subject<ActionModalConfig>();
  private actionModalConfirmed?: (value: boolean) => void;

  editScheduleModal$ = this.editLessonInfoModalSubject.asObservable();
  editLessonModal$ = this.editLessonModalSubject.asObservable();
  editTeacherModal$ = this.editTeacherModalSubject.asObservable();
  editStudentModal$ = this.editStudentModalSubject.asObservable();
  editGroupModal$ = this.editGroupModalSubject.asObservable();
  actionModal$ = this.actionModalSubject.asObservable();

  openCreateLessonInfoModal(lessonNumber: number, groupId: number, weekDay: DayOfWeek) {
    this.editLessonInfoModalSubject.next({
      type: 'create',
      data: { lessonNumber, groupId, weekDay }
    });
  }

  openEditLessonInfoModal(lessonInfo: LessonInfo) {
    this.editLessonInfoModalSubject.next({
      type: 'edit',
      data: lessonInfo
    });
  }

  openCreateLessonModal() {
    this.editLessonModalSubject.next({
      type: 'edit',
    });
  }

  openEditLessonModal(lesson: Lesson) {
    this.editLessonModalSubject.next({
      type: 'edit',
      data: lesson
    });
  }

  openCreateTeacherModal() {
    this.editTeacherModalSubject.next({
      type: 'edit',
    });
  }

  openEditTeacherModal(teacher: Teacher) {
    this.editTeacherModalSubject.next({
      type: 'edit',
      data: teacher
    });
  }

  openCreateStudentModal() {
    this.editStudentModalSubject.next({
      type: 'edit',
    });
  }

  openEditStudentModal(student: User) {
    this.editStudentModalSubject.next({
      type: 'edit',
      data: student
    });
  }

  openCreateGroupModal(facultyId: number) {
    console.log("fac id in modal is ", facultyId)
    this.editGroupModalSubject.next({
      type: 'create',
      data: facultyId
    });
  }

  openEditGroupModal(group: Group) {
    this.editGroupModalSubject.next({
      type: 'edit',
      data: group
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
