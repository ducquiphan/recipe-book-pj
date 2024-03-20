import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;


  private SIGNUP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.API_KEY;
  private LOGIN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.API_KEY;

  constructor(private http: HttpClient, private router: Router) {
  }

  signUp(email: string, password: string) {

    return this.http.post<AuthResponse>(this.SIGNUP_URL, {
      email: email,
      password: password,
      returnSecureToken: true,
    }).pipe(
      catchError(this.handleError),
      tap(res => {
        this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn);
      }));
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponse>(this.LOGIN_URL, {
      email: email,
      password: password,
      returnSecureToken: true,
    }).pipe(
      catchError(this.handleError),
      tap(res => {
        this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn);
      }));
  }

  signOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('user');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred. Please try again later.";
    console.log(err);
    if (!err.error || !err.error.error) {
      return throwError(errorMessage);
    }
    switch (err.error.error.message) {
      case "EMAIL_EXISTS":
        errorMessage = "This email already exists";
        break;
      case "EMAIL_NOT_FOUND":
        errorMessage = "This email does not exist";
        break;
      case "INVALID_PASSWORD":
        errorMessage = "This password is incorrect";
    }
    return throwError(errorMessage);
  }

  autoLogin() {
    const user: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return;
    }
    const loadUser = new User(user.email, user.id, user._token, new Date(user._tokenExpirationDate));
    if (loadUser.token) {
      this.user.next(loadUser);
      const expirationDuration = loadUser.tokenExpirationDate.getTime() - new Date().getDate();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.signOut();
    }, expirationDuration);
  }
}
