export interface ClassroomGetDTO {
  uuidClassroom: string;
  name: string;
  course: string;
  adminUsername: string;
  studentsUsername: string[];
}

export interface ClassroomPostDTO {
  name: string;
  course: string;
  adminUsername: string;
  studentsUsername: string;
}

export interface ClassroomPutDTO {
  uuidClassroom: string;
  name: string;
  course: string;
  adminUsername: string;
  studentsUsername: string[]
}
