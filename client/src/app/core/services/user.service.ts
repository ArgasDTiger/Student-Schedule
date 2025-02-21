import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import {BehaviorSubject, Observable} from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isBrowser = false;
  currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly apollo: Apollo
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setCurrentUser() {
    if (!this.isBrowser) return;

    this.apollo.query<{ currentUser: User }>({
      query: gql`
        query CurrentUser {
          currentUser {
            firstName,
            lastName,
            middleName,
            groups {
              id,
              groupNumber
            },
            faculties {
              id,
              name
              groups {
                id,
                groupNumber,
              }
            }
            role
          }
        }
      `,
    })
    .subscribe({
      next: response => {
        this.currentUser$.next(response.data.currentUser ?? null);
      },
      error: () => {
        this.currentUser$.next(null);
      }
    });
  }

  getStudents(search?: string): Observable<User[]> {
    if (!this.isBrowser) return new Observable<User[]>();
    return this.apollo.query<{ students?: User[] }>({
      query: gql`
        query Students($search: String) {
          students(search: $search) {
            id
            firstName
            lastName
            middleName
            email
          }
        }
      `,
      variables: { search }
    }).pipe(
      map(result => (result.data?.students ?? []) as User[])
    );
  }

  getStudentsByGroup(search?: string, groupId?: number): Observable<User[]> {
    if (!this.isBrowser) return new Observable<User[]>();
    return this.apollo.query<{ studentsByGroup?: User[] }>({
      query: gql`
        query StudentsByGroup($search: String, $groupId: Int!) {
          studentsByGroup(search: $search, groupId: $groupId) {
            id
            firstName
            lastName
            middleName
            email
          }
        }
      `,
      variables: { search, groupId }
    }).pipe(
      map(result => (result.data?.studentsByGroup ?? []) as User[])
    );
  }

  getStudentsOutsideGroup(search?: string, groupId?: number): Observable<User[]> {
    if (!this.isBrowser) return new Observable<User[]>();
    return this.apollo.query<{ studentsOutsideGroup?: User[] }>({
      query: gql`
        query StudentsOutsideGroup($search: String, $groupId: Int!) {
          studentsOutsideGroup(search: $search, groupId: $groupId) {
            id
            firstName
            lastName
            middleName
            email
          }
        }
      `,
      variables: { search, groupId }
    }).pipe(
      map(result => (result.data?.studentsOutsideGroup ?? []) as User[])
    );
  }

  async addUserToGroup(userId: number, groupId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ addUserToGroup: boolean }>({
        mutation: gql`
          mutation AddUserToGroup($userId: Int!, $groupId: Int!) {
            addUserToGroup(userId: $userId, groupId: $groupId)
          }
        `,
        variables: { userId, groupId }
      })
      .toPromise();
      return result?.data?.addUserToGroup ?? false;
    } catch {
      return false;
    }
  }

  async removeUserFromGroup(userId: number, groupId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ removeUserFromGroup: boolean }>({
        mutation: gql`
          mutation RemoveUserFromGroup($userId: Int!, $groupId: Int!) {
            removeUserFromGroup(userId: $userId, groupId: $groupId)
          }
        `,
        variables: { userId, groupId }
      })
      .toPromise();
      return result?.data?.removeUserFromGroup ?? false;
    } catch {
      return false;
    }
  }
}
