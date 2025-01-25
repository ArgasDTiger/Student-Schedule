import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {Apollo, gql} from "apollo-angular";
import {map} from "rxjs/operators";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  logout() {
    if (!this.isBrowser) return;
    localStorage.removeItem("token");
  }

  isAuthorized() {
    if (!this.isBrowser) return false;
    const token = localStorage.getItem("token");
    return !!token;
  }

  saveToken(token: string) {
    if (!this.isBrowser) return;
    localStorage.setItem("token", token);
  }
  login(credentials: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation Login($credentials: String!) {
            login(requestToken: $credentials) {
              token
              user {
                  firstName
                  lastName
                  dateOfBirth
                  email
                  googleId
                  role
                  id
              }
            }
          }
        `,
        variables: { credentials },
      })
      .pipe(
        map((result: any) => {
          this.saveToken(result.data.login.token);
          return result.data.login;
        }));
  }
}
