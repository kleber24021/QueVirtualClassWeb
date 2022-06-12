import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ResourceService} from "../../../services/resources/resource.service";
import {ResourceGetLiteDTO} from "../../../models/resources/resources.model";
import {CoreComponent} from "../../../components/core-component/core.component";
import {map} from "rxjs";
import {environment} from "../../../../environments/environment";
import Swal from "sweetalert2";
import {AuthService} from "../../../services/auth/auth.service";

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.component.html',
  styles: []
})
export class ResourcesListComponent extends CoreComponent implements OnInit {

  resourcesList: ResourceGetLiteDTO[] = [];
  classroomId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private resourceService: ResourceService,
    private authService: AuthService,
    private router: Router
  ) {
    super()
  }

  ngOnInit(): void {
    this.classroomId = this.activatedRoute.snapshot.params['id'];
    this.getResourcesList()
  }

  getResourcesList(){
    this.resourceService.getAllUploadedResourcesByClassroomAndType(this.classroomId, '')
      .pipe(
        map(resourceList =>
          resourceList.map(resource => {
            let resourceEndpoint = resource.resourceEndpoint;
            resource.resourceEndpoint = `${environment.apiUrl}resources/file/${resourceEndpoint}?username=${this.authService.username}`;
            return resource;
          })
        )
      )
      .subscribe({
        next: val => {
          this.resourcesList = val
        },
        error: err => {
          this.showDialog(`${err.status} ${err.message}`, "Error al traer los recursos", "error")
        }
      })
  }

  deleteResource(resource: ResourceGetLiteDTO) {
    Swal.fire({
      title: `¿Seguro que quieres eliminar ${resource.resourceName}?`,
      text: 'Esta acción no tiene vuelta atrás',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
    }).then(result => {
      if (result.isConfirmed){
        this.resourceService.deleteResource(resource.uuidResource)
          .subscribe({
            next: msg =>{
              this.showDialog(msg, "Recurso eliminado", "success");
              this.getResourcesList()
            },
            error: err => {
              this.showDialog(`${err.status} ${err.message}`, "Error al eliminar el recurso", "error");
            }
          })
      }
    })
  }

  goToResourceDetail(uuidResource: string) {
    this.router.navigateByUrl(`/upload/${uuidResource}`)
  }
}
