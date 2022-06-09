import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ClassroomsService} from "../../../services/classrooms/classrooms.service";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../../services/users/users.service";
import {UserGetDTO} from "../../../models/user/user.model";
import {ClassroomGetDTO} from "../../../models/classroom/classroom.model";
import {CoreComponent} from "../../../components/core-component/core.component";
import {Observable} from "rxjs";
import {IDropdownSettings} from "ng-multiselect-dropdown";

@Component({
  selector: 'app-classroom-detail',
  templateUrl: './classroom-detail.component.html',
  styles: []
})
export class ClassroomDetailComponent extends CoreComponent implements OnInit {

  // @ts-ignore
  classroomForm: FormGroup;

  // @ts-ignore
  classroom: ClassroomGetDTO;
  classroomId: string = '';
  allUsers: UserGetDTO[] = [];
  selectedStudents: UserGetDTO[] = []
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private formBuilder: FormBuilder,
    private classroomService: ClassroomsService,
    private studentsService: UsersService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super()
    this.classroomId = this.activatedRoute.snapshot.params['id']
    if (this.classroomId !== 'create'){
      this.classroomForm = this.formBuilder.group({
        uuidClassroom: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        course: new FormControl('', [Validators.required]),
        adminUsername: new FormControl('', [Validators.required]),
        studentsUsername: new FormControl([], [Validators.required])
      });
    }else{
      this.classroomForm = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        course: new FormControl('', [Validators.required]),
        adminUsername: new FormControl('', [Validators.required]),
        studentsUsername: new FormControl([], [Validators.required])
      });
    }

    //Creamos la coonfiguración del dropdown
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'username',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    }
  }

  get studentsUsername() {
    return this.classroomForm.get('studentsUsername') as FormControl
  }

  get classroomName(): Observable<string> {
    return new Observable((observer) => {
      if (this.classroom) {
        observer.next(this.classroom.name)
      } else {
        observer.next("N/A")
      }
    })
  }

  ngOnInit(): void {
    //Guardamos todos los usuarios en una lista
    this.studentsService.getAllUsers()
      .subscribe({
        next: res => {
          this.allUsers = res;
        },
        error: err => {
          this.showDialog(`${err.status} ${err.statusText}`, "Error al recoger los alumnos", "error")
        }
      })

    //Traemos el classroom de base de datos
    if (this.classroomId !== 'create'){
      this.classroomService.getClassroomById(this.classroomId)
        .subscribe({
          next: res => {
            this.classroom = res;

            this.classroomForm.get('uuidClassroom')?.setValue(res.uuidClassroom);
            this.classroomForm.get('name')?.setValue(res.name);
            this.classroomForm.get('course')?.setValue(res.course);
            this.classroomForm.get('adminUsername')?.setValue(res.adminUsername);

            let users = []
            for (let student of res.studentsUsernames) {
              users.push(this.allUsers.filter(user => {
                return user.username === student
              })[0])
            }
            this.classroomForm.get('studentsUsername')?.setValue(users);
          },
          error: err => {
            this.showDialog(`${err.status} ${err.statusText}`, "Error al recoger la clase", "error")
          }
        })
    }
  }

  onSubmit() {
    this.classroomForm.get('studentsUsername')?.setValue(
      this.classroomForm.get('studentsUsername')?.value
        .map((student:any) => student.username)
    )
    this.classroomService.editClassroom(this.classroomForm.value)
      .subscribe({
        next: val =>{
          this.showDialog("Clase editada correctamente", "", "success")
            .then(result =>{
              this.router.navigateByUrl('classrooms')
            })
        },
        error: err =>{
          this.showDialog(`${err.status} ${err.message}`, "Clase no editada", "error")
        }
      })
  }
}
