import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2'
import {LoginUser} from "../../models/user/user.model";
import {CoreComponent} from "../../components/core-component/core.component";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent extends CoreComponent implements OnInit {
  user: LoginUser;
  remember = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    super();
    this.user = new LoginUser();
  }

  ngOnInit(): void {
    if (localStorage.getItem('username')) {
      this.user.username = localStorage.getItem('username')!;
      this.remember = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return
    }
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info'
    });
    Swal.showLoading();

    this.authService.doLogin(this.user).subscribe({
      next: res => {
      Swal.close();
      if (this.remember) {
        localStorage.setItem('username', this.user.username)
      }
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        })

        Toast.fire({
          icon: 'success',
          title: `Logueado correctamente. ¡Bienvenid@, ${res.body?.name}!`
        })
      this.router.navigateByUrl('/upload');
    },
    error: error => {
      Swal.close()
      console.log(error)
      this.showDialog(`${error.status} ${error.statusText}`, "Error al autenticar", "error")
    }
    })
  }

}
