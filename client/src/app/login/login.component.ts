import {Component, NgZone, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {Router} from "@angular/router";
import {AuthService} from "../core/services/auth.service";
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import {environment} from "../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(private router: Router,
              private service: AuthService,
              private toastr: ToastrService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.onGoogleLibraryLoad = () => {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: environment.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // @ts-ignore
        google.accounts.id.renderButton(
          // @ts-ignore
          document.getElementById("googleBtn"),
          {
            theme: "outline",
            size: "large",
            shape: "square",
            text: "signin",
            width: "500",
            logo_alignment: "left"
          }
        );

        // @ts-ignore
        google.accounts.id.prompt((notification: PromptMomentNotification) => {});
      };
    }
  }


  async handleCredentialResponse(response: CredentialResponse) {
    this.service.login(response.credential).subscribe(
      x => {
        this.router.navigate(['/logout']);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
