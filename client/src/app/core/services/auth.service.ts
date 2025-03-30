import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import {map, take} from "rxjs/operators";
import {isPlatformBrowser} from "@angular/common";
import {RefreshTokenResponse} from "../responses/refresh-token-response";
import {UserService} from "./user.service";
import {BehaviorSubject, of} from "rxjs";
import {RevokeTokenResponse} from "../responses/revoke-token-response";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isBrowser = false;
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  public isLoading$ = this.isLoadingSubject.asObservable();
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private readonly apollo: Apollo,
              private userService: UserService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.userService.isLoading$.subscribe(isLoading => {
      this.isLoadingSubject.next(isLoading);
    });
  }

  async revokeToken() {
    if (!this.isBrowser) return;
    return this.apollo
    .mutate<RevokeTokenResponse>({
      mutation: gql`
        mutation RefreshToken {
          revokeToken
        }`
    })
    .toPromise()
    .then(response => {
      return response?.data?.revokeToken === true;
    })
    .catch(e => {
      return false;
    });
  }

  isAuthorized() {
    if (!this.isBrowser) return of(false);

    return this.userService.currentUser$.pipe(
      map(user => {
        return !!user;
      }));
  }

  setLoading(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
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
          if (this.isBrowser) {
            localStorage.setItem("sidebar_collapsed", "false");
          }
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
