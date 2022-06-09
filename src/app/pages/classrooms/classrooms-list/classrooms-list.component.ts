import { Component, OnInit } from '@angular/core';
import {ClassroomGetDTO} from "../../../models/classroom/classroom.model";
import {ClassroomsService} from "../../../services/classrooms/classrooms.service";
import {AuthService} from "../../../services/auth/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-classrooms-list',
  templateUrl: './classrooms-list.component.html',
  styles: []
})
export class ClassroomsListComponent implements OnInit {

  classrooms: ClassroomGetDTO[] = []
  constructor(
    private classroomService: ClassroomsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getAllClassrooms();
  }

  getAllClassrooms(){
    // @ts-ignore
    this.classroomService.getAllClassroomsByUsername(this.authService.username)
      .subscribe({
        next: res =>{
          this.classrooms = res;
        },
        error: err =>{
          Swal.fire({
            title: 'Error al traer las clases',
            text: `${err.status} ${err.statusText}`,
            icon: 'error'
          })
        }
      })
  }

  deleteClassroom(classroom: ClassroomGetDTO) {
    Swal.fire({
      title: `¿Seguro que quieres eliminar ${classroom.name}?`,
      text: 'Esta acción no tiene vuelta atrás y todos los recursos de la clase se perderán...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
    }).then(result => {
      if (result.isConfirmed){
        this.classroomService.deleteClassroom(classroom.uuidClassroom)
          .subscribe({
            next: _=>{
              Swal.fire({
                title: '¡Eliminado!',
                text: 'La clase y todos sus recursos se han eliminado correctamente',
                icon: 'success'
              }).then(ans =>{
                if (ans.isConfirmed || ans.isDenied || ans.isDismissed){
                  this.getAllClassrooms();
                }
              })

            },
            error: err =>{
              Swal.fire({
                title: 'Error inesperado',
                text: `${err.status} ${err.statusText}`,
                icon: 'error'
              })
            }
          })

      }
    })
  }
}
