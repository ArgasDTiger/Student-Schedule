import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class ToasterManagerService {
  isBrowser = false;
  constructor(
    private readonly _toasterService: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  success(message: string) {
    if (!this.isBrowser) return;
    return this._toasterService.success(message);
  }

  error(message: string) {
    if (!this.isBrowser) return;
    return this._toasterService.error(message);
  }

  clear(toastId: number) {
    if (!this.isBrowser) return;
    this._toasterService.clear(toastId);
  }
}
