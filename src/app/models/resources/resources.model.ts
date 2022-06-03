import {ResourceService} from "../../services/resources/resource.service";

export enum ResourceType{
  VIDEO = 'VIDEO', IMAGE = 'IMAGE', URL = 'URL'
}
export interface ResourceGetDetailDTO {
  uuidResource: string;
  resourceName: string;
  resourceEndpoint: string;
  timeStamp: string;
  classroomUUID: string;
  resourceType: ResourceType;
  comments: ResourceComment[];
}

export interface ResourceGetLiteDTO{
  uuidResource: string;
  resourceName: string;
  resourceEndpoint: string;
  timeStamp: string;
  resourceType: ResourceService;
}

export interface ResourceComment{
  uuidComment: string;
  text: string;
  usernameOwner: string;
  timeStamp: string;
}
