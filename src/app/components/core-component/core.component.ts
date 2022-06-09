import Swal, {SweetAlertIcon} from "sweetalert2";

export class CoreComponent {

  constructor() {
  }

  showDialog(message: string, title: string, type: SweetAlertIcon) {
    return Swal.fire({
      text: message,
      icon: type,
      title: title
    })
  }
}

