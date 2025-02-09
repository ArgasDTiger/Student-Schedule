import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {User} from "../models/user";
import {Apollo, gql} from "apollo-angular";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isBrowser = false;
  currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo) {
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
      error: err => {
        this.currentUser$.next(null);
      }
    });
  }
}
