import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import Swal from "sweetalert2";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private jwtService: JwtHelperService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.userToken;

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      })
      return next.handle(cloned).pipe(
        tap(
          event => {
            if (event instanceof HttpResponse && event.headers.get('Authorization')) {
              if (event.ok) {
                this.authService.setSession(event.headers.get('Authorization')!)
              }
            }
          }
        ),
        catchError(err => {
          console.log("ERROR:", err)
          if (err instanceof HttpErrorResponse){
            if (err.status === 0){
              Swal.fire({
                title: "Sesión expirada",
                text: "Vuelva a iniciar sesión",
                icon: "info"
              })
              this.authService.doLogout();
            }
          }
          return throwError(err);
        }))
    } else {
      return next.handle(req);
    }
  }

}
