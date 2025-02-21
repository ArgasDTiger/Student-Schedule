import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private readonly apollo: Apollo) {}

  promoteUserToModerator(userId: number): Observable<boolean> {
    return this.apollo.mutate<{ promoteUserToModerator: boolean }>({
      mutation: gql`
        mutation PromoteUserToModerator($userId: Int!) {
          promoteUserToModerator(userId: $userId)
        }
      `,
      variables: { userId }
    }).pipe(
      map(result => result.data?.promoteUserToModerator ?? false)
    );
  }

  demoteUserFromModerator(userId: number): Observable<boolean> {
    return this.apollo.mutate<{ demoteUserFromModerator: boolean }>({
      mutation: gql`
        mutation DemoteUserFromModerator($userId: Int!) {
          demoteUserFromModerator(userId: $userId)
        }
      `,
      variables: { userId }
    }).pipe(
      map(result => result.data?.demoteUserFromModerator ?? false)
    );
  }
}
