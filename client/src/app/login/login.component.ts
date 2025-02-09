import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import { Subscription } from 'rxjs';
import {SocialAuthService} from "@abacritt/angularx-social-login";
import {NgOptimizedImage} from "@angular/common";
import {AuthService} from "../core/services/auth.service";
import {Router} from "@angular/router";
import {ToasterManagerService} from "../core/services/toaster-manager.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  authSubscription!: Subscription;

  constructor(private socialAuthService: SocialAuthService,
              private authService: AuthService,
              private router: Router,
              private toasterManager: ToasterManagerService) {}

  ngOnInit() {
    this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
      this.authService.login(user.idToken).subscribe(
        x => {
          this.router.navigate(['']);
        },
        (error: any) => {
          this.toasterManager.error("Виникла помилка під час авторизації.")
        }
      );
    });
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

  public createWrapper() {
    const googleLoginWrapper = document.createElement('div');
    googleLoginWrapper.style.display = 'none';
    document.body.appendChild(googleLoginWrapper);
    // @ts-ignore
    window.google.accounts.id.renderButton(googleLoginWrapper, {
      type: 'icon',
      width: '200',
    });

    const googleLoginWrapperButton = googleLoginWrapper.querySelector(
      'div[role=button]'
    ) as HTMLElement;

    return {
      click: () => {
        googleLoginWrapperButton?.click();
      },
    };
  };


  public login(googleWrapper: any) {
    googleWrapper.click();
  }
}
