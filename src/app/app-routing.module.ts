import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClassroomsListComponent} from "./pages/classrooms/classrooms-list/classrooms-list.component";
import {ResourcesListComponent} from "./pages/resources/resources-list/resources-list.component";
import {UploadComponent} from "./pages/upload/upload.component";
import {LoginComponent} from "./pages/login/login.component";
import {UsersListComponent} from "./pages/users/users-list/users-list.component";
import {AuthGuardService} from "./services/auth/auth-guard.service";

const routes: Routes = [
  {path: 'classrooms', component: ClassroomsListComponent, canActivate: [AuthGuardService]},
  {path: 'resources', component: ResourcesListComponent, canActivate: [AuthGuardService]},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuardService]},
  {path: 'users', component: UsersListComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'upload'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
