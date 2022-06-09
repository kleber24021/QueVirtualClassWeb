import { Component, OnInit } from '@angular/core';
import {UsersService} from "../../../services/users/users.service";
import {UserGetDTO} from "../../../models/user/user.model";
import {CoreComponent} from "../../../components/core-component/core.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent extends CoreComponent implements OnInit {

  usersList: UserGetDTO[] = [];

  constructor(
    private usersService: UsersService
  ) {
    super()
  }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(){
    this.usersService.getAllUsers()
      .subscribe({
        next: users => this.usersList = users,
        error: err => this.showDialog(`${err.status} ${err.statusMessage}`, 'Error al traer los usuarios', 'error')
      })
  }

  deleteUser(user: UserGetDTO) {
    Swal.fire({
      title: `¿Seguro que quieres eliminar a ${user.username}?`,
      text: 'Esta acción no tiene vuelta atrás',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
    }).then(result => {
      if (result.isConfirmed){
        this.usersService.deleteUser(user.username)
          .subscribe({
            next: msg =>{
              this.showDialog(msg, "Usuario eliminado", "success");
              this.getUserList();
            },
            error: err => {
              this.showDialog(`${err.status} ${err.message}`, "Error al eliminar el usuario", "error");
            }
          })
      }
    })
  }
}
