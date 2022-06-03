import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ResourceService} from "../../services/resources/resource.service";
import Swal from "sweetalert2";
import {ClassroomGetDTO} from "../../models/classroom/classroom.model";
import {ClassroomsService} from "../../services/classrooms/classrooms.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styles: [
  ]
})
export class UploadComponent implements OnInit {

  // @ts-ignore
  uploadForm: FormGroup
  classrooms : ClassroomGetDTO[] = []

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: ResourceService,
    private classroomService: ClassroomsService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      resourceName: new FormControl('', [Validators.required]),
      classroomUUID: new FormControl('', [Validators.required, Validators.minLength(36), Validators.maxLength(36)]),
      resourceType: new FormControl('', [Validators.required]),
      resourceFile: new FormControl('', [Validators.required])
      }
    )
    this.getClassrooms();
  }


  onFileSelect(event: any){
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.uploadForm.get('resourceFile')?.setValue(file);
    }
  }

  onSubmit(){
    if (this.uploadForm.invalid){
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Inválido',
        text: `Rellene todos los campos del formulario`
      })
      return
    }
    //We transform formgroup to formData to send in form
    const formData = new FormData();
    formData.append('resourceName', this.uploadForm.get('resourceName')!.value)
    formData.append('classroomUUID', this.uploadForm.get('classroomUUID')!.value)
    formData.append('resourceType', this.uploadForm.get('resourceType')!.value)
    formData.append('resourceFile', this.uploadForm.get('resourceFile')!.value)

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading();

    this.uploadService.postUploadResource(formData)
      .subscribe(
        (res: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Recurso subido',
            text: `Recurso con la id: ${res['uuidResource']}`
          })
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: err.error.error.message
          })
        });
  }

  getClassrooms(){
    let userLogged = this.authService.username!;
    this.classroomService.getAllClassroomsByUsername(userLogged)
      .subscribe(res => {
        this.classrooms = res;
      })
  }

}
