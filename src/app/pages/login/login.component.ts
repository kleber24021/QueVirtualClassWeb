import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2'
import {LoginUser} from "../../models/user/user.model";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  user: LoginUser;
  remember = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
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

    this.authService.doLogin(this.user).subscribe(
      res => {
        Swal.close();
        if (this.remember) {
          localStorage.setItem('username', this.user.username)
        }
        this.router.navigateByUrl('/upload');
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: 'Error al iniciar sesión'
        })
      }
    )
  }

}
