import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgForOf, NgIf} from "@angular/common";
import {DayOfWeek} from "../core/enums/dayOfWeek";
import {LessonComponent} from "./lesson/lesson.component";
import {LessonInfo} from "../core/models/lessonInfo";
import {ScheduleService} from "../core/services/schedule.service";
import {LessonNumber} from "../core/enums/lessonNumber";
import {UserService} from "../core/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {ToasterManagerService} from "../core/services/toaster-manager.service";
import {Subscription} from "rxjs";
import {Role} from "../core/enums/role";
import {EditScheduleModalComponent} from "../moderator/edit-schedule-modal/edit-schedule-modal.component";
import { lessonNumberToTimeSpanMap } from '../core/mappings/lessonNumberToTimeSpan';
import { degreeToString } from '../core/mappings/degreeToString';
import {ModalService} from "../core/services/modal.service";
import { lessonTypeToString } from '../core/mappings/lessonTypeToString';
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    LessonComponent,
    NgForOf,
    EditScheduleModalComponent,
    NgIf,
    MatIconModule
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private userSubscription?: Subscription;
  private resizeObserver?: ResizeObserver;

  lessons: LessonInfo[] = [];
  maxLessonNumber: number = 5;
  lessonNumbers: number[] = [];
  moderatorLessonNumbers: number[] = [1, 2, 3, 4, 5];
  daysOfWeek = Object.values(DayOfWeek).slice(0, 5);
  dayLabels = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця'];
  isBrowser = false;
  userRole?: Role;
  groupId?: number;

  // Mobile view properties
  isMobile = false;
  selectedDayIndex = 0;

  // Import references to map objects
  protected readonly lessonNumberToTimeSpanMap = lessonNumberToTimeSpanMap;
  protected readonly degreeToString = degreeToString;
  protected readonly lessonTypeToString = lessonTypeToString;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private scheduleService: ScheduleService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private scheduleModalService: ModalService,
              private toasterManagerService: ToasterManagerService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.userRole = user?.role;
    });

    this.route.params.subscribe(params => {
      const groupId = params['id'];
      if (groupId) {
        this.loadSchedule(Number(groupId));
        this.groupId = +groupId;
        return;
      }
      this.route.parent?.params.subscribe(parentParams => {
        const parentGroupId = parentParams['id'];
        if (parentGroupId) {
          this.loadSchedule(Number(parentGroupId));
          this.groupId = +parentGroupId;
          return;
        }

        this.userService.currentUser$.pipe(
          take(1)
        ).subscribe(async user => {
          if (user?.groups?.length) {
            await this.router.navigate(['student/schedule', user.groups[0].id]);
          }
        });
      });
    });

    if (this.isBrowser) {
      this.checkScreenSize();
      this.resizeObserver = new ResizeObserver(() => {
        this.checkScreenSize();
      });
      this.resizeObserver.observe(document.body);
    }
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  getLesson(lessonNumber: number, day: DayOfWeek) {
    return this.lessons.find(lesson => lesson.lessonNumber === LessonNumber[lessonNumber] && lesson.weekDay === day);
  }

  private loadSchedule(groupId: number) {
    this.scheduleService.getScheduleByGroupId(groupId).subscribe({
        next: (lessons: LessonInfo[]) => {
          this.lessons = lessons;
          if (this.lessons.length > 0) {
            const maxLessonNumberString = this.lessons.slice().sort((a, b) => LessonNumber[b.lessonNumber] - LessonNumber[a.lessonNumber])[0].lessonNumber;
            this.maxLessonNumber = LessonNumber[maxLessonNumberString];
          }
          this.lessonNumbers = Array.from({ length: this.maxLessonNumber }, (_, i) => i + 1);
        },
        error: () => {
          this.toasterManagerService.error("Помилка при завантаженні розкладу.");
        }
      }
    );
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 992;
  }

  selectDay(index: number) {
    this.selectedDayIndex = index;
  }

  openCreateModal(lessonNumber: number, weekDay: DayOfWeek) {
    if (this.groupId) {
      this.scheduleModalService.openCreateLessonInfoModal(lessonNumber, this.groupId, weekDay);
    }
  }

  openEditModal(lesson: LessonInfo) {
    this.scheduleModalService.openEditLessonInfoModal(lesson);
  }

  async deleteScheduleItem(lesson: LessonInfo) {
    const confirmed = await this.scheduleModalService.openActionModal({
      header: 'Видалення предмету',
      message: 'Ви впевнені, що хочете видалити цей предмет з розкладу?',
      buttonText: 'Видалити',
      buttonColor: 'red'
    });

    if (!confirmed) {
      return;
    }

    const success = await this.scheduleService.deleteScheduleItem(lesson.id, lesson.group.id);

    if (success) {
      this.toasterManagerService.success("Успішно видалено предмет розкладу.");
      this.loadSchedule(lesson.group.id);
    } else {
      this.toasterManagerService.error("Помилка при видаленні предмету з розкладу.");
    }
  }

  protected readonly Role = Role;
  protected readonly DayOfWeek = DayOfWeek;
}
