import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { map } from 'rxjs/operators';
import { LessonInfo } from '../models/lessonInfo';
import {isPlatformBrowser} from "@angular/common";
import {Observable} from "rxjs";
import {Lesson} from "../models/lesson";
import {Teacher} from "../models/teacher";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getTeachers() {
    if (!this.isBrowser) return new Observable<Teacher[]>();
    return this.apollo
      .watchQuery<{ teachers: Teacher[] }>({
        query: gql`
          query Teachers {
            teachers {
              id,
              firstName,
              middleName,
              lastName
            }
          }
        `,
      })
      .valueChanges.pipe(
        map(result => result.data.teachers)
      );
  }
}
