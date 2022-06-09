import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ClassroomGetDTO, ClassroomPostDTO, ClassroomPutDTO} from "../../models/classroom/classroom.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ClassroomsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllClassroomsByUsername(username: string) {
    let params = new HttpParams().set('username', username)
    return this.http.get<ClassroomGetDTO[]>(`${environment.apiUrl}classrooms`, {params: params});
  }

  getClassroomById(classroomId: string){
    return this.http.get<ClassroomGetDTO>(`${environment.apiUrl}classrooms/${classroomId}`);
  }

  createClassroom(classroomToCreate: ClassroomPostDTO) {
    return this.http.post<ClassroomGetDTO>(`${environment.apiUrl}classrooms`, classroomToCreate);
  }

  editClassroom(classroomToEdit: ClassroomPutDTO) {
    return this.http.put<ClassroomGetDTO>(`${environment.apiUrl}classrooms`, classroomToEdit);
  }

  deleteClassroom(classroomUUID: string) {
    return this.http.delete<string>(`${environment.apiUrl}classrooms/${classroomUUID}`);
  }
}
