import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ClassroomsListComponent} from "./pages/classrooms/classrooms-list/classrooms-list.component";
import {ResourcesListComponent} from "./pages/resources/resources-list/resources-list.component";
import {UploadComponent} from "./pages/resources/upload/upload.component";
import {LoginComponent} from "./pages/login/login.component";
import {UsersListComponent} from "./pages/users/users-list/users-list.component";
import {AuthGuardService} from "./services/auth/auth-guard.service";
import {ClassroomDetailComponent} from "./pages/classrooms/classroom-detail/classroom-detail.component";
import {UserDetailComponent} from "./pages/users/user-detail/user-detail.component";

const routes: Routes = [
  {path: 'resources/:id', component: ResourcesListComponent, canActivate: [AuthGuardService]},
  {path: 'classrooms/:id', component: ClassroomDetailComponent, canActivate: [AuthGuardService]},
  {path: 'classrooms', component: ClassroomsListComponent, canActivate: [AuthGuardService]},
  {path: 'upload/:id', component: UploadComponent, canActivate: [AuthGuardService]},
  {path: 'users', component: UsersListComponent, canActivate: [AuthGuardService]},
  {path: 'users/:id', component: UserDetailComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'upload/create'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
