import { Injectable } from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { map } from 'rxjs/operators';
import { LessonInfo } from '../models/lessonInfo';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private readonly apollo: Apollo) { }

  getScheduleByGroupId(groupId: number) {
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
