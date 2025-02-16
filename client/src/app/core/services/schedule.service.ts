import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { map } from 'rxjs/operators';
import { LessonInfo } from '../models/lessonInfo';
import {isPlatformBrowser} from "@angular/common";
import {Observable} from "rxjs";
import {DeleteLessonInfoResponse} from "../responses/delete-lesson-info-response";
import {UpdateLessonInfoRequest} from "../inputs/update-lesson-info-request";
import {AddLessonInfoInput} from "../inputs/add-lesson-info-input";

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

  createScheduleItem(lessonInfo: AddLessonInfoInput) {
    return this.apollo.mutate({
      mutation: gql`
        mutation CreateLessonInfo($lessonInfo: AddLessonInfoInput!) {
          createLessonInfo(lessonInfo: $lessonInfo) {
            weekDay
            lessonNumber
          }
        }
      `,
      variables: { lessonInfo: lessonInfo }
    }).pipe(
      map((result: any) => result.data.createLessonInfo)
    );
  }

  updateScheduleItem($lessonInfo: UpdateLessonInfoRequest) {
    return this.apollo
    .mutate({
      mutation: gql`
        mutation UpdateLessonInfo($lessonInfo: UpdateLessonInfoInput!) {
          updateLessonInfo(lessonInfo: $lessonInfo) {
            weekDay
            lessonNumber
          }
        }
      `,
      variables: { $lessonInfo },
    })
    .pipe(
      map((result: any) => {
        return result.data.updateLessonInfo;
      }));
  }

  async deleteScheduleItem($id: number) {
    return this.apollo
    .mutate<DeleteLessonInfoResponse>({
      mutation: gql`
        mutation DeleteLessonInfo($id: Int!) {
          deleteLessonInfo(id: $id)
        }
      `,
      variables: {$id}
    })
    .toPromise()
    .then(response => {
      return response?.data?.deleteLessonInfo === true;
    })
    .catch(() => {
      return false;
    });
  }
}
