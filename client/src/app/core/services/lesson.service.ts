import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { map } from 'rxjs/operators';
import {isPlatformBrowser} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";
import {Lesson} from "../models/lesson";

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private lessonsRefreshSubject = new BehaviorSubject<void>(undefined);
  lessonsRefresh$ = this.lessonsRefreshSubject.asObservable();
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getLessons(search: string = ''): Observable<Lesson[]> {
    if (!this.isBrowser) return new Observable<Lesson[]>();
    return this.apollo
    .watchQuery<{ lessons: Lesson[] }>({
      query: gql`
        query Lessons($search: String) {
          lessons(search: $search) {
            id,
            name
          }
        }
      `,
      variables: { search },
      fetchPolicy: 'cache-and-network'
    })
    .valueChanges.pipe(
      map(result => result.data.lessons)
    );
  }

  getArchivedLessons(search: string = ''): Observable<Lesson[]> {
    if (!this.isBrowser) return new Observable<Lesson[]>();
    return this.apollo
    .watchQuery<{ archivedLessons: Lesson[] }>({
      query: gql`
        query ArchivedLessons($search: String) {
          archivedLessons(search: $search) {
            id,
            name
          }
        }
      `,
      variables: { search },
      fetchPolicy: 'cache-and-network'
    })
    .valueChanges.pipe(
      map(result => result.data.archivedLessons)
    );
  }


  createLesson(name: string): Observable<Lesson> {
    if (!this.isBrowser) return new Observable<Lesson>();
    return this.apollo.mutate<{ createLesson: Lesson }>({
      mutation: gql`
        mutation CreateLesson($name: String!) {
          createLesson(name: $name) {
            id
            name
          }
        }
      `,
      variables: { name },
      refetchQueries: ['Lessons']
    }).pipe(
      map(result => {
        if (!result?.data?.createLesson) {
          throw new Error('Помилка при створенні предмету.');
        }
        this.lessonsRefreshSubject.next();
        return result.data.createLesson;
      })
    );
  }

  async updateLesson(lesson: Lesson): Promise<boolean> {
    if (!this.isBrowser) return false;
    const input = {
      id: lesson.id,
      name: lesson.name
    };

    try {
      const result = await this.apollo.mutate<{ updateLesson: boolean }>({
        mutation: gql`
          mutation UpdateLesson($lesson: UpdateLessonInput!) {
            updateLesson(lesson: $lesson)
          }
        `,
        variables: { lesson: input },
        refetchQueries: ['Lessons', 'ArchivedLessons']
      }).toPromise();

      if (result?.data?.updateLesson) {
        this.lessonsRefreshSubject.next();
      }
      return result?.data?.updateLesson ?? false;
    } catch {
      return false;
    }
  }

  async archiveLesson(lessonId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ archiveLesson: boolean }>({
        mutation: gql`
          mutation ArchiveLesson($lessonId: Int!) {
            archiveLesson(lessonId: $lessonId)
          }
        `,
        variables: { lessonId },
        refetchQueries: ['Lessons', 'ArchivedLessons']
      }).toPromise();

      if (result?.data?.archiveLesson) {
        this.lessonsRefreshSubject.next();
      }
      return result?.data?.archiveLesson ?? false;
    } catch {
      return false;
    }
  }

  async publishLesson(lessonId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ publishLesson: boolean }>({
        mutation: gql`
          mutation PublishLesson($lessonId: Int!) {
            publishLesson(lessonId: $lessonId)
          }
        `,
        variables: { lessonId },
        refetchQueries: ['Lessons', 'ArchivedLessons']
      }).toPromise();

      if (result?.data?.publishLesson) {
        this.lessonsRefreshSubject.next();
      }
      return result?.data?.publishLesson ?? false;
    } catch {
      return false;
    }
  }

  async deleteLesson(lessonId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ deleteLesson: boolean }>({
        mutation: gql`
          mutation DeleteLesson($lessonId: Int!) {
            deleteLesson(lessonId: $lessonId)
          }
        `,
        variables: { lessonId },
        refetchQueries: ['Lessons', 'ArchivedLessons']
      }).toPromise();

      if (result?.data?.deleteLesson) {
        this.lessonsRefreshSubject.next();
      }
      return result?.data?.deleteLesson ?? false;
    } catch {
      return false;
    }
  }
}
