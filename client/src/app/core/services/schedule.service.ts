import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { map } from 'rxjs/operators';
import { LessonInfo } from '../models/lessonInfo';
import {isPlatformBrowser} from "@angular/common";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getScheduleByGroupId(groupId: number) {
    if (!this.isBrowser) return new Observable<LessonInfo[]>();
    return this.apollo
      .watchQuery<{ scheduleByStudentGroup: LessonInfo[] }>({
        query: gql`
          query ScheduleByStudentGroup($groupId: Int!) {
            scheduleByStudentGroup(groupId: $groupId) {
              weekDay
              lessonNumber
              type
              room
              oddWeek
              evenWeek
              lesson {
                id
                name
              }
              group {
                id
                groupNumber
                faculty {
                  id
                  name
                  corpusNumber
                }
              }
              teacher {
                id
                firstName
                middleName
                lastName
                degree
              }
            }
          }
        `,
        variables: {
          groupId: groupId,
        },
      })
      .valueChanges.pipe(
        map(result => result.data.scheduleByStudentGroup)
      );
  }
}
