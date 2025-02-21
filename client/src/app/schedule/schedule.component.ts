import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, NgForOf} from "@angular/common";
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
import {Group} from "../core/models/group";
import {EditScheduleModalComponent} from "../moderator/edit-schedule-modal/edit-schedule-modal.component";

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    LessonComponent,
    NgForOf,
    EditScheduleModalComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private userSubscription?: Subscription;

  lessons: LessonInfo[] = [];
  maxLessonNumber: number = 5;
  lessonNumbers: number[] = [];
  moderatorLessonNumbers: number[] = [1, 2, 3, 4, 5];
  daysOfWeek = Object.values(DayOfWeek).slice(0, 5);
  isBrowser = false;
  userRole?: Role;
  groupId?: number;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private scheduleService: ScheduleService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
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
            await this.router.navigate(['/schedule', user.groups[0].id]);
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  getLesson(lessonNumber: number, day: string) {
    return this.lessons.find(lesson => lesson.lessonNumber === LessonNumber[lessonNumber] && lesson.weekDay === day);
  }

  private loadSchedule(groupId: number) {
    this.scheduleService.getScheduleByGroupId(groupId).subscribe({
        next: (lessons: LessonInfo[]) => {
          this.lessons = lessons;
          const maxLessonNumberString = this.lessons.slice().sort((a, b) => LessonNumber[b.lessonNumber] - LessonNumber[a.lessonNumber])[0].lessonNumber;
          this.maxLessonNumber = LessonNumber[maxLessonNumberString];
          this.lessonNumbers = Array.from({ length: this.maxLessonNumber }, (_, i) => i + 1);
        },
        error: () => {
          this.toasterManagerService.error("Помилка при завантаженні розкладу.");
        }
      }
    );
  }

  protected readonly Role = Role;
}
