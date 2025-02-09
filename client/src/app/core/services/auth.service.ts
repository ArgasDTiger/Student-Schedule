import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map} from "rxjs/operators";
import {isPlatformBrowser} from "@angular/common";
import {catchError, of} from "rxjs";
import {RefreshTokenResponse} from "../responses/refresh-token-response";

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

  login(idToken: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation Login($idToken: String!) {
            login(idToken: $idToken) {
              firstName,
              lastName
            }
          }
        `,
        variables: { idToken },
      })
      .pipe(
        map((result: any) => {
          return result.data.login;
        }));
  }

  async refreshToken(): Promise<boolean> {
    return this.apollo
    .mutate<RefreshTokenResponse>({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }`
    })
    .toPromise()
    .then(response => {
      return response?.data?.refreshToken === true;
    })
    .catch(e => {
      return false;
    });
  }

}
