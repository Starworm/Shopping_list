import {Component, ComponentFactoryResolver, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {PlaceholderDirective} from '../Components/shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent {

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) {  // for using programmatically dynamic components
  }

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective; // for using programmatically dynamic components

  private closeSub: Subscription; // for using programmatically dynamic components

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authOps: Observable<string | AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authOps = this.authService.login(email, password);
    } else {
      authOps = this.authService.signUp(email, password);
    }

    authOps.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      }, errorMsg => {
        this.error = errorMsg;
        // this.showErrorAlert(errorMsg); // for using programmatically dynamic components
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  // for programmatically controlled dynamic components
  // ngOnDestroy() {
  //   if(this.closeSub) {
  //     this.closeSub.unsubscribe();
  //   }
  // }

  // programmatically controlled dynamic components
  // private showErrorAlert(message: string) {
  //   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();
  //
  //   const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
  //
  //   componentRef.instance.message = message;
  //   this.closeSub = componentRef.instance.close.subscribe(
  //     () => {
  //       this.closeSub.unsubscribe();
  //       hostViewContainerRef.clear();
  //     }
  //   );
  // }
}
