import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {isPlatformBrowser} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";
import {Group} from "../models/group";
import {map} from "rxjs/operators";
import {Lesson} from "../models/lesson";
import {AddGroupInput} from "../inputs/add-group-input";
import {UpdateGroupInput} from "../inputs/update-group-input";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupsRefreshSubject = new BehaviorSubject<void>(undefined);
  groupsRefresh$ = this.groupsRefreshSubject.asObservable();
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private readonly apollo: Apollo
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getGroups(facultyId: number, search: string = ''): Observable<Group[]> {
    if (!this.isBrowser) return new Observable<Group[]>();
    return this.apollo
    .watchQuery<{ groups: Group[] }>({
      query: gql`
        query Groups($facultyId: Int!, $search: String) {
          groups(facultyId: $facultyId, search: $search) {
            id
            groupNumber
            faculty {
              id
              name
            }
          }
        }
      `,
      variables: { facultyId, search },
      fetchPolicy: 'cache-and-network'
    })
    .valueChanges.pipe(
      map(result => result.data.groups)
    );
  }

  createGroup(group: AddGroupInput): Observable<Group> {
    if (!this.isBrowser) return new Observable<Group>();
    group.groupNumber = +group.groupNumber;
    return this.apollo.mutate<{ createGroup: Group }>({
      mutation: gql`
        mutation CreateGroup($group: AddGroupInput!) {
          createGroup(group: $group) {
            id
            groupNumber
          }
        }
      `,
      variables: { group }
    }).pipe(
      map(result => {
        this.groupsRefreshSubject.next();
        return result.data?.createGroup as Group;
      })
    );
  }

  async updateGroup(group: UpdateGroupInput): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ updateGroup: boolean }>({
        mutation: gql`
          mutation UpdateGroup($group: UpdateGroupInput!) {
            updateGroup(group: $group)
          }
        `,
        variables: { group }
      }).toPromise();
      this.groupsRefreshSubject.next();
      return result?.data?.updateGroup ?? false;
    } catch {
      return false;
    }
  }

  async deleteGroup(groupId: number): Promise<boolean> {
    if (!this.isBrowser) return false;
    try {
      const result = await this.apollo.mutate<{ deleteGroup: boolean }>({
        mutation: gql`
          mutation DeleteGroup($groupId: Int!) {
            deleteGroup(groupId: $groupId)
          }
        `,
        variables: { groupId }
      }).toPromise();
      this.groupsRefreshSubject.next();
      return result?.data?.deleteGroup ?? false;
    } catch {
      return false;
    }
  }
}
