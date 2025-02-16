import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import {filter, map} from 'rxjs/operators';
import { LessonInfo } from '../models/lessonInfo';
import {isPlatformBrowser} from "@angular/common";
import {Observable, throwError} from "rxjs";
import {DeleteLessonInfoResponse} from "../responses/delete-lesson-info-response";
import {UpdateLessonInfoInput} from "../inputs/update-lesson-info-input";
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

  private readonly SCHEDULE_QUERY = gql`
    query ScheduleByStudentGroup($groupId: Int!) {
      scheduleByStudentGroup(groupId: $groupId) {
        id,
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
  `;

  getScheduleByGroupId(groupId: number) {
    if (!this.isBrowser) return new Observable<LessonInfo[]>();
    return this.apollo
      .watchQuery<{ scheduleByStudentGroup: LessonInfo[] }>({
        query: this.SCHEDULE_QUERY,
        variables: {
          groupId: groupId,
        },
      })
      .valueChanges.pipe(
        map(result => result.data.scheduleByStudentGroup)
      );
  }

  createScheduleItem(lessonInfo: AddLessonInfoInput) {
    if (!this.isBrowser) return new Observable<LessonInfo>();
    return this.apollo.mutate({
      mutation: gql`
        mutation CreateLessonInfo($lessonInfo: AddLessonInfoInput!) {
          createLessonInfo(lessonInfo: $lessonInfo) {
            weekDay
            lessonNumber
          }
        }
      `,
      variables: { lessonInfo: lessonInfo },
      refetchQueries: [{
        query: this.SCHEDULE_QUERY,
        variables: { groupId: lessonInfo.groupId }
      }],
      awaitRefetchQueries: true
    }).pipe(
      map((result: any) => {
        if (result.data.createLessonInfo.errors?.length > 0) {
          throwError(() => new Error(result.data.errors[0].message));
        }
        return result.data.createLessonInfo;
      })
    );
  }

  async updateScheduleItem(lessonInfo: UpdateLessonInfoInput): Promise<boolean> {
    if (!this.isBrowser) return Promise.resolve(false);
    return this.apollo
    .mutate<{ updateLessonInfo: boolean; }>({
      mutation: gql`
        mutation UpdateLessonInfo($lessonInfo: UpdateLessonInfoInput!) {
          updateLessonInfo(lessonInfo: $lessonInfo)
        }
      `,
      variables: { lessonInfo },
      refetchQueries: [{
        query: this.SCHEDULE_QUERY,
        variables: { groupId: lessonInfo.groupId }
      }],
      awaitRefetchQueries: true
    })
    .toPromise()
    .then(response => {
      return response?.data?.updateLessonInfo === true;
    })
    .catch(() => {
      return false;
    });
  }

  async deleteScheduleItem(id: number, groupId: number) {
    if (!this.isBrowser) return Promise.resolve(false);
    return this.apollo
    .mutate<DeleteLessonInfoResponse>({
      mutation: gql`
        mutation DeleteLessonInfo($id: Int!) {
          deleteLessonInfo(id: $id)
        }
      `,
      variables: { id },
      refetchQueries: [{
        query: this.SCHEDULE_QUERY,
        variables: { groupId }
      }],
      awaitRefetchQueries: true
    })
    .toPromise()
    .then(response => {
      return response?.data?.deleteLessonInfo === true;
    })
    .catch(() => {
      return false;
    });
  }

  subscribeToLessonInfoCreations(groupId: number): Observable<LessonInfo> {
    if (!this.isBrowser) return new Observable<LessonInfo>();
    return this.apollo.subscribe<{ lessonInfoCreated?: LessonInfo }>({
      query: gql`
        subscription LessonInfoCreated($groupId: Int!) {
          lessonInfoCreated(groupId: $groupId) {
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
            }
            teacher {
              firstName
              lastName
            }
          }
        }
      `,
      variables: { groupId }
    }).pipe(
      filter(result => !!result.data?.lessonInfoCreated),
      map(result => result.data!.lessonInfoCreated as LessonInfo)
    );
  }

}
