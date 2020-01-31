// Service for management of signing in, up and tokens

import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment';
import {DataStorageService} from '../Components/shared/data-storage.service';

// defines types of data we recieve from server after registration. See 'Response Payload' on
// https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router,
              private dataStorageService: DataStorageService) {
  }

  signUp(email: string, password: string) {
    return this.http.post<any | AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),
      tap(
        resData => {
          this.handleAuthentification(
            resData[email],
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
    );
  }

  login(email: string, password: string) {
    return this.http.post<any | AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(catchError(this.handleError),
      tap(
        resData => {
          this.handleAuthentification(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        }));
  }

  // getting user data from local storage for autologin
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      // getting remained time for autologout
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.dataStorageService.isLoadedRecipes = false;
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // for autologout after certain period of time
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);

  }

  private handleAuthentification(email: string, userId: string, token: string, expiresIn: number) {

    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    // saving user to local storage for further autologin
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    // if no suitable error type found
    let errorMsg = 'An unknown error occured!';

    // if error response has no error key
    if (!errorRes.error || !errorRes.error.error) {
      return errorMsg;
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'E-mail already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'This E-mail does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'Password is not correct';
        break;
    }
    return throwError(errorMsg);
  }

}
