import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";


@Injectable({ providedIn: "root" })
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(exprirationDuration: number) {
    console.log(exprirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, exprirationDuration);
  }

  clearLogoutTime() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
