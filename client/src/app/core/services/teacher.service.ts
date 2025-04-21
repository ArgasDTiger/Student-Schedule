import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { map } from 'rxjs/operators';
import {isPlatformBrowser} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";
import {Teacher} from "../models/teacher";
import {GetTeacherInput} from "../inputs/get-teacher-input";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private teachersRefreshSubject = new BehaviorSubject<void>(undefined);
  teachersRefresh$ = this.teachersRefreshSubject.asObservable();
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

    getTeachers(teacherInput: GetTeacherInput) {
    if (!this.isBrowser) return new Observable<Teacher[]>();

    return this.apollo
      .watchQuery<{ teachers: Teacher[] }>({
        query: gql`
          query Teachers($teacherInput: GetTeacherInput!) {
            teachers(teacherInput: $teacherInput) {
              id,
              firstName,
              middleName,
              lastName,
              degree
            }
          }
        `,
       variables: { teacherInput },
       fetchPolicy: 'cache-and-network'
    })
      .valueChanges.pipe(
        map(result => result.data.teachers)
      );
  }

  getArchivedTeachers(search: string = '') {
    if (!this.isBrowser) return new Observable<Teacher[]>();
    return this.apollo
    .watchQuery<{ archivedTeachers: Teacher[] }>({
      query: gql`
        query ArchivedTeachers($search: String) {
          archivedTeachers(search: $search) {
            id,
            firstName,
            middleName,
            lastName,
            degree
          }
        }
      `,
      variables: { search },
      fetchPolicy: 'cache-and-network'
    })
    .valueChanges.pipe(
      map(result => result.data.archivedTeachers)
    );
  }

  createTeacher(teacher: Teacher): Observable<Teacher> {
    if (!this.isBrowser) return new Observable<Teacher>;
    return  this.apollo.mutate<{ createTeacher: Teacher }>({
        mutation: gql`
          mutation CreateTeacher($teacher: AddTeacherInput!) {
            createTeacher(teacher: $teacher) {
              id,
              firstName,
              middleName,
              lastName,
              degree
            }
          }
        `,
        variables: { teacher },
        refetchQueries: ['Teachers', 'ArchivedTeachers']
    })
    .pipe(
        map(result => {
          if (!result?.data?.createTeacher) {
            throw new Error('Помилка при створенні викладача.');
          }
          return result.data.createTeacher;
        }
        ),
      );
  }

  async updateTeacher(teacher: Teacher): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ updateTeacher: boolean }>({
        mutation: gql`
          mutation UpdateTeacher($teacher: UpdateTeacherInput!) {
            updateTeacher(teacher: $teacher)
          }
        `,
        variables: { teacher },
        refetchQueries: ['Teachers', 'ArchivedTeachers']
      }).toPromise();
      return result?.data?.updateTeacher ?? false;
    } catch {
      return false;
    }
  }

  async archiveTeacher(teacherId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ archiveTeacher: boolean }>({
        mutation: gql`
          mutation ArchiveTeacher($teacherId: Int!) {
            archiveTeacher(teacherId: $teacherId)
          }
        `,
        variables: { teacherId },
        refetchQueries: ['Teachers', 'ArchivedTeachers']
      }).toPromise();
      return result?.data?.archiveTeacher ?? false;
    } catch {
      return false;
    }
  }

  async publishTeacher(teacherId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ publishTeacher: boolean }>({
        mutation: gql`
          mutation PublishTeacher($teacherId: Int!) {
            publishTeacher(teacherId: $teacherId)
          }
        `,
        variables: { teacherId },
        refetchQueries: ['Teachers', 'ArchivedTeachers']
      }).toPromise();
      return result?.data?.publishTeacher ?? false;
    } catch {
      return false;
    }
  }

  async deleteTeacher(teacherId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ deleteTeacher: boolean }>({
        mutation: gql`
          mutation DeleteTeacher($teacherId: Int!) {
            deleteTeacher(teacherId: $teacherId)
          }
        `,
        variables: { teacherId },
        refetchQueries: ['Teachers', 'ArchivedTeachers']
      }).toPromise();
      return result?.data?.deleteTeacher ?? false;
    } catch {
      return false;
    }
  }
}
