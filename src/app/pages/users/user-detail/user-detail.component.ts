import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../../services/users/users.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CoreComponent} from "../../../components/core-component/core.component";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styles: []
})
export class UserDetailComponent extends CoreComponent implements OnInit {

  //@ts-ignore
  userForm: FormGroup;
  userId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super();
    this.activatedRoute.params
      .subscribe(params => this.userId = params['id']);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      profileImage: new FormControl('', []),
      userType: new FormControl('', [Validators.required]),
    });
    if (this.userId !== 'create') {
      this.userForm.addControl('password', new FormControl(''));
      this.userForm.addControl('passwordConfirmation', new FormControl(''));
      this.userService.getUserByUsername(this.userId)
        .subscribe({
          next: res => {
            this.userForm.get('username')?.setValue(res.username);
            this.userForm.get('name')?.setValue(res.name);
            this.userForm.get('surname')?.setValue(res.surname);
            this.userForm.get('email')?.setValue(res.email);
            this.userForm.get('userType')?.setValue(res.userType);
            if (res.profileImage) {
              this.userForm.get('profileImage')?.setValue(res.profileImage);
            }
          },
          error: err => this.showDialog(`${err.status} ${err.statusMessage}`, 'Error al traer usuario', 'error')
        });
    } else {
      this.userForm.addControl('password', new FormControl('', [Validators.required]));
      this.userForm.addControl('passwordConfirmation', new FormControl('', [Validators.required]));
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      console.log('ERROR')
    } else {
      console.log('To submit: ', this.userForm.value);
      let pswdValidation = this.userForm.get('password')?.value === this.userForm.get('passwordConfirmation')?.value;
      if (this.userId === 'create') {
        if (pswdValidation) {
          this.userService.createUser(this.userForm.value)
            .subscribe({
              next: value => {
                this.showDialog('Usuario creado', '', 'success');
                this.router.navigateByUrl(`/users/${this.userForm.get('username')?.value}`)
              },
              error: err => this.showDialog('Error al actualizar', 'ERROR', 'error')
            })
        } else {
          this.showDialog('Las contraseñas no coinciden', '', 'error');
        }
      } else {
        if (pswdValidation) {
          if (this.userForm.get('password')?.value === '') {
            this.userService.editUser({
              username: this.userForm.get('username')?.value,
              name: this.userForm.get('name')?.value,
              surname: this.userForm.get('surname')?.value,
              email: this.userForm.get('email')?.value,
              profileImage: this.userForm.get('profileImage')?.value,
              userType: this.userForm.get('userType')?.value
            })
              .subscribe({
                next: value => this.showDialog('Usuario actualizado', '', 'success'),
                error: err => this.showDialog('Error al actualizar', 'ERROR', 'error')
              })
          }else {
            this.userService.editUser({
              username: this.userForm.get('username')?.value,
              name: this.userForm.get('name')?.value,
              surname: this.userForm.get('surname')?.value,
              email: this.userForm.get('email')?.value,
              profileImage: this.userForm.get('profileImage')?.value,
              userType: this.userForm.get('userType')?.value,
              password: this.userForm.get('password')?.value
            })
              .subscribe({
                next: value => this.showDialog('Usuario actualizado', '', 'success'),
                error: err => this.showDialog('Error al actualizar', 'ERROR', 'error')
              })
          }
        } else {
          this.showDialog('Las contraseñas no coinciden', '', 'error');
        }
      }
    }
  }
}
