import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {LoginUser, UserGetDTO} from "../../models/user/user.model";
import { environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  loginEndpoint = "users/"

  constructor(
    private http: HttpClient
  ) { }

  doLogin(user: LoginUser){
    const encodedPassword = btoa(`${user.username}:${user.password}`)
    const basicHeader = `Basic ${encodedPassword}`
    const headers = new HttpHeaders({
      'Authorization': basicHeader
    })
    return this.http.get<UserGetDTO>(`${environment.apiUrl}${this.loginEndpoint}${user.username}`, {headers: headers, observe: "response"})
      .pipe(
        tap(response => {
          if (response.status === 200){
            localStorage.setItem('username', user.username);
            this.setSession(response.headers.get('Authorization')!);
          }
        })
      )
  }

  doLogout(){
    localStorage.removeItem('username');
  }

  public isLoggedIn(){
    return localStorage.getItem('token') !== null;
  }

  public get userToken(){
    return localStorage.getItem('token');
  }

  public get username(){
    return localStorage.getItem('username');
  }

  public setSession(tokenToSave: string){
    localStorage.setItem('token', tokenToSave);
  }

}
