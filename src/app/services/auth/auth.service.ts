import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {tap} from "rxjs";
import {LoginUser, UserGetDTO} from "../../models/user/user.model";
import {environment} from "../../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  loginEndpoint = "users/"

  constructor(
    private http: HttpClient,
    private jwtService: JwtHelperService
  ) {
  }

  public get userToken() {
    return sessionStorage.getItem('token');
  }

  public get username() {
    return localStorage.getItem('username');
  }

  doLogin(user: LoginUser) {
    const encodedPassword = btoa(`${user.username}:${user.password}`)
    const basicHeader = `Basic ${encodedPassword}`
    const headers = new HttpHeaders({
      'Authorization': basicHeader
    })
    return this.http.get<UserGetDTO>(`${environment.apiUrl}${this.loginEndpoint}${user.username}`, {
      headers: headers,
      observe: "response"
    })
      .pipe(
        tap(response => {
          if (response.status === 200) {
            localStorage.setItem('username', user.username);
            this.setSession(response.headers.get('Authorization')!);
          }
        })
      )
  }

  doLogout() {
    sessionStorage.removeItem('token');
  }

  public isLoggedIn() {
    let token = sessionStorage.getItem('token');
    if (token !== null){
      if (!this.jwtService.isTokenExpired(token)){
        return true;
      }
    }
    return false;
  }

  public setSession(tokenToSave: string) {
    sessionStorage.setItem('token', tokenToSave);
  }

  ngOnDestroy(): void {
    this.doLogout();
  }

}
