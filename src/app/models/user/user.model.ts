export enum UserType{
  TEACHER='TEACHER', STUDENT='STUDENT'
}

export interface UserGetDTO{
  username: string;
  name: string;
  surname: string;
  email: string;
  profileImage: string;
  userType: UserType;
}

export interface UserPostPutDTO{
  username:string;
  name:string;
  surname:string;
  email:string;
  profileImage:string;
  userType: UserType;
  password:string;
}


export class LoginUser{
  username: string = '';
  password: string = '';
}
