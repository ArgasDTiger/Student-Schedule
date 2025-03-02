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
  private studentsRefreshSubject = new BehaviorSubject<void>(undefined);
  private moderatorsRefreshSubject = new BehaviorSubject<void>(undefined);

  isBrowser = false;
  currentUser$ = new BehaviorSubject<User | null>(null);
  studentsRefresh$ = this.studentsRefreshSubject.asObservable();
  moderatorsRefresh$ = this.moderatorsRefreshSubject.asObservable();

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

  addStudent(user: User): Observable<User> {
    if (!this.isBrowser) return new Observable<User>();
    return this.apollo.mutate<{ addStudent: User }>({
      mutation: gql`
        mutation AddStudent($user: AddStudentInput!) {
          addStudent(user: $user) {
            id
            firstName
            lastName
            middleName
            email
          }
        }
      `,
      variables: { user },
      refetchQueries: ['Students']
    }).pipe(
      map(result => {
        this.studentsRefreshSubject.next();
        return result.data?.addStudent as User;
      })
    );
  }

  async updateStudent(user: User): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ updateStudent: boolean }>({
        mutation: gql`
          mutation UpdateStudent($user: UpdateStudentInput!) {
            updateStudent(user: $user)
          }
        `,
        variables: { user },
        refetchQueries: ['Students']
      }).toPromise();
      this.studentsRefreshSubject.next();
      return result?.data?.updateStudent ?? false;
    } catch {
      return false;
    }
  }

  async removeStudent(userId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ removeStudent: boolean }>({
        mutation: gql`
          mutation RemoveStudent($userId: Int!) {
            removeStudent(userId: $userId)
          }
        `,
        variables: { userId }
      }).toPromise();
      return result?.data?.removeStudent ?? false;
    } catch {
      return false;
    }
  }

  async addModeratorToFaculty(userId: number, facultyId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ addModeratorToFaculty: boolean }>({
        mutation: gql`
          mutation AddModeratorToFaculty($userId: Int!, $facultyId: Int!) {
            addModeratorToFaculty(userId: $userId, facultyId: $facultyId)
          }
        `,
        variables: { userId, facultyId }
      }).toPromise();
      this.moderatorsRefreshSubject.next();
      return result?.data?.addModeratorToFaculty ?? false;
    } catch {
      return false;
    }
  }

  async removeModeratorFromFaculty(userId: number, facultyId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ removeModeratorFromFaculty: boolean }>({
        mutation: gql`
          mutation RemoveModeratorFromFaculty($userId: Int!, $facultyId: Int!) {
            removeModeratorFromFaculty(userId: $userId, facultyId: $facultyId)
          }
        `,
        variables: { userId, facultyId },
        refetchQueries: ['Students']
      }).toPromise();
      this.moderatorsRefreshSubject.next();
      return result?.data?.removeModeratorFromFaculty ?? false;
    } catch {
      return false;
    }
  }

  getModerators(search: string = '', facultyId: number): Observable<User[]> {
    if (!this.isBrowser) return new Observable<User[]>();
    return this.apollo
    .watchQuery<{ moderators: User[] }>({
      query: gql`
        query Moderators($search: String, $facultyId: Int!) {
          moderators(search: $search, facultyId: $facultyId) {
            id,
            firstName,
            lastName,
            middleName,
            email
          }
        }
      `,
      variables: { search, facultyId },
      fetchPolicy: 'cache-and-network'
    })
    .valueChanges.pipe(
      map(result => result.data.moderators)
    );
  }

  getUsers(search: string = ''): Observable<User[]> {
    if (!this.isBrowser) return new Observable<User[]>();
    return this.apollo
    .watchQuery<{ users: User[] }>({
      query: gql`
        query Users($search: String) {
          users(search: $search) {
            id,
            firstName,
            lastName,
            middleName,
            email
          }
        }
      `,
      variables: { search },
      fetchPolicy: 'cache-and-network'
    })
    .valueChanges.pipe(
      map(result => result.data.users)
    );
  }


}
