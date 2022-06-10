import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResourceGetDetailDTO, ResourceGetLiteDTO, ResourcePutDTO} from "../../models/resources/resources.model";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  postUploadResource(formData: FormData) {
    return this.httpClient.post<any>(`${environment.apiUrl}resources`, formData);
  }
  getAllUploadedResourcesByClassroomAndType(classroomId: string, resourceType: string) {
    let params = new HttpParams().set('classroomId', classroomId)
    params.append('resourceType', resourceType)
    return this.httpClient.get<ResourceGetLiteDTO[]>(`${environment.apiUrl}resources/all`, {params: params});
  }

  getResourceDetail(resourceUUID: string) {
    return this.httpClient.get<ResourceGetDetailDTO>(`${environment.apiUrl}resources/detail/${resourceUUID}`);
  }

  editResource(resourceToEdit: ResourcePutDTO) {
    return this.httpClient.put(`${environment.apiUrl}resources/`, resourceToEdit, {responseType: 'text'});
  }

  deleteResource(resourceUUID: string) {
    return this.httpClient.delete(`${environment.apiUrl}resources/${resourceUUID}`, {responseType: 'text'});
  }
}
