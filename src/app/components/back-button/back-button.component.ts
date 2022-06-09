import {Component} from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styles: []
})
export class BackButtonComponent {

  constructor(
    private location: Location
  ) {
  }

  goBack() {
    this.location.back();
  }
}
