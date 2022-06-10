import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resources/resource.service";
import Swal from "sweetalert2";
import {ClassroomGetDTO} from "../../../models/classroom/classroom.model";
import {ClassroomsService} from "../../../services/classrooms/classrooms.service";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute} from "@angular/router";
import {ResourceGetDetailDTO} from "../../../models/resources/resources.model";
import {CoreComponent} from "../../../components/core-component/core.component";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styles: []
})
export class UploadComponent extends CoreComponent implements OnInit {

  // @ts-ignore
  uploadForm: FormGroup
  classrooms: ClassroomGetDTO[] = []
  resourceId: string = ''
  // @ts-ignore
  editingResource: ResourceGetDetailDTO;

  constructor(
    private formBuilder: FormBuilder,
    private resourceService: ResourceService,
    private classroomService: ClassroomsService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.activatedRoute.params
      .subscribe({
        next: value => {
          this.resourceId = value['id'];
        }
      })
    if (this.resourceId === 'create') {
      this.uploadForm = this.formBuilder.group({
        resourceName: new FormControl('', [Validators.required]),
        classroomUUID: new FormControl('', [Validators.required, Validators.minLength(36), Validators.maxLength(36)]),
        resourceType: new FormControl('', [Validators.required]),
        resourceFile: new FormControl('', [Validators.required])
      })
    } else {
      this.uploadForm = this.formBuilder.group({
        uuidResource: new FormControl('', [Validators.required]),
        resourceName: new FormControl('', [Validators.required]),
        classroomUUID: new FormControl('', [Validators.required, Validators.minLength(36), Validators.maxLength(36)]),
        resourceType: new FormControl('', [Validators.required]),
      })
    }

    if (this.resourceId !== 'create') {
      this.resourceService.getResourceDetail(this.resourceId)
        .subscribe({
          next: value => {
            this.editingResource = value;
            this.uploadForm.get('uuidResource')?.setValue(value.uuidResource);
            this.uploadForm.get('resourceName')?.setValue(value.resourceName);
            this.uploadForm.get('classroomUUID')?.setValue(value.classroomUUID);
            this.uploadForm.get('resourceType')?.setValue(value.resourceType);
          },
          error: err => this.showDialog(`${err.status} ${err.message}`, "No se ha podido traer los detalles de este recurso", 'error')
        })
    }
    this.getClassrooms();
  }

  ngOnInit(): void {

  }


  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('resourceFile')?.setValue(file);
    }
  }

  onSubmit() {
    if (this.uploadForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario Inválido',
        text: `Rellene todos los campos del formulario`
      })
      return
    }
    if (this.resourceId === 'create') {
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

      this.resourceService.postUploadResource(formData)
        .subscribe({
          next: (res: any) => {
            this.showDialog(`Recurso con la id: ${res['uuidResource']}`, 'Recurso subido', 'success');
          },
          error: error => {
            this.showDialog(error.error, 'Error al autenticar', 'error')
          }
        });
    } else {
      this.resourceService.editResource(this.uploadForm.value)
        .subscribe({
          next: msg => {
            this.showDialog(msg, 'Recurso actualizado', 'success');
          },
          error: error => {
            this.showDialog(`${error.status} ${error.statusText}`, 'Error al autenticar', 'error')
          }
        })
    }
  }

  getClassrooms() {
    let userLogged = this.authService.username!;
    this.classroomService.getAllClassroomsByUsername(userLogged)
      .subscribe(res => {
        this.classrooms = res;
      })
  }

}
