import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResourceGetLiteDTO, ResourceGetDetailDTO, ResourceType} from "../../models/resources/resources.model";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  postUploadResource(formData: FormData){
    return this.httpClient.post(`${environment.apiUrl}resources`, formData);
  }

  getAllUploadedResourcesByClassroom(classroomId: string, resourceType: ResourceType){
    let params = new HttpParams().set('classroomId', classroomId)
    params.append('resourceType', resourceType)
    return this.httpClient.get<ResourceGetLiteDTO>(`${environment.apiUrl}resources/all`, {params: params});
  }

  getResourceFileUrl(resourceEndpoint: string){
    return `${environment.apiUrl}resources/file/${resourceEndpoint}`;
  }

  getResourceDetail(resourceUUID: string){
    return this.httpClient.get<ResourceGetDetailDTO>(`${environment.apiUrl}resources/detail/${resourceUUID}`);
  }

  editResource(){
    //TODO: Implementar editar recursos en front y back
  }

  deleteResource(resourceUUID: string){
    return this.httpClient.delete(`${environment.apiUrl}resources/${resourceUUID}`)
  }
}
