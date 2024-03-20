import {Component, OnDestroy, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResponse, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  form !: FormGroup;
  closeSubscription: Subscription;


  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService, private router: Router) {
    this.form = new FormGroup({
      "email": new FormControl('', [Validators.email, Validators.required]),
      "password": new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const email = this.form.get('email').value;
    const password = this.form.get('password').value;

    let authObs: Observable<AuthResponse>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.signIn(email, password);
    } else {
      authObs = this.authService.signUp(email, password);
    }
    authObs.subscribe(
      res => {
        this.isLoading = false;
        console.log(res);
        this.router.navigate(['/recipes']);
      }, errorMessage => {
        this.isLoading = false;
        this.showErrorAlert(errorMessage);
        this.error = errorMessage;
      },
    );

    this.form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(errorMessage: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertComponent = hostViewContainerRef.createComponent(AlertComponent);
    alertComponent.instance.message = errorMessage;
    this.closeSubscription = alertComponent.instance.close.subscribe(() => {
      this.onHandleError();
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
