import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import {  Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placehoder.directive";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
})
export class AuthComponent implements OnInit,OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSub: Subscription;
  private storeSub: Subscription;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.storeSub = this.store.select("auth").subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    // let authObs: Observable<AuthResponseData>;
    if (this.isLoginMode) {
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.store.dispatch(
        new AuthActions.SignupStart({ email: email, password: password })
      );
    }

    form.reset;
  }

  onHandleError() {
  this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert(message: string) {
    //for angular 9 higher
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;

    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(){
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
    if(this.storeSub){
      this.storeSub.unsubscribe();
    }

  }
}
