import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserGetDTO, UserPostPutDTO} from "../../models/user/user.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  createUser(userToCreate: UserPostPutDTO){
    return this.httpClient.post<UserGetDTO>(`${environment.apiUrl}users`, userToCreate);
  }

  editUser(userToEdit: any){
    console.log(userToEdit);
    return this.httpClient.put<UserGetDTO>(`${environment.apiUrl}users`, userToEdit);
  }

  getAllUsers(){
    return this.httpClient.get<UserGetDTO[]>(`${environment.apiUrl}users`)
  }

  getUserByClassroomId(classroomId: string){
    return this.httpClient.get<UserGetDTO[]>(`${environment.apiUrl}users/classroom/${classroomId}`)
  }

  getUserByUsername(username: string){
    return this.httpClient.get<UserGetDTO>(`${environment.apiUrl}users/${username}`)
  }

  deleteUser(username: string){
    return this.httpClient.delete(`${environment.apiUrl}users/${username}`, {responseType: "text"})
  }
}
