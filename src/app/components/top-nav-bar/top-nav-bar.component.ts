import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styles: [
  ]
})
export class TopNavBarComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  doLogout(){
    this.authService.doLogout();
  }

}
