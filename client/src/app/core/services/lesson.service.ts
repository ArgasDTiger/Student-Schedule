import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { map } from 'rxjs/operators';
import { LessonInfo } from '../models/lessonInfo';
import {isPlatformBrowser} from "@angular/common";
import {Observable} from "rxjs";
import {Lesson} from "../models/lesson";

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getLessons() {
    if (!this.isBrowser) return new Observable<Lesson[]>();
    return this.apollo
      .watchQuery<{ lessons: Lesson[] }>({
        query: gql`
          query Lessons {
            lessons {
                id,
                name
              }
            }
        `,
      })
      .valueChanges.pipe(
        map(result => result.data.lessons)
      );
  }
}
