import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavBarComponent } from './components/top-nav-bar/top-nav-bar.component';
import { ClassroomsListComponent } from './pages/classrooms/classrooms-list/classrooms-list.component';
import { LoginComponent } from './pages/login/login.component';
import { ResourcesListComponent } from './pages/resources/resources-list/resources-list.component';
import { UploadComponent } from './pages/resources/upload/upload.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./services/auth/tokenInterceptor";
import { ClassroomDetailComponent } from './pages/classrooms/classroom-detail/classroom-detail.component';
import {NgMultiSelectDropDownModule} from "ng-multiselect-dropdown";
import { BackButtonComponent } from './components/back-button/back-button.component';
import { UserDetailComponent } from './pages/users/user-detail/user-detail.component';
import {JwtModule} from "@auth0/angular-jwt";
import {environment} from "../environments/environment";

export function tokenGetter(){
  return sessionStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    TopNavBarComponent,
    ClassroomsListComponent,
    LoginComponent,
    ResourcesListComponent,
    UploadComponent,
    UsersListComponent,
    ClassroomDetailComponent,
    BackButtonComponent,
    UserDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    JwtModule.forRoot({
      config:{
        tokenGetter: tokenGetter,
        allowedDomains: [environment.domain]
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
