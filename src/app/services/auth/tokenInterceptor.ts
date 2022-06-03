import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.userToken;

    if(token) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      })
      return next.handle(cloned).pipe(
        tap(event => {
          if (event instanceof HttpResponse && event.headers.get('Authorization')){
            if (event.ok){
              this.authService.setSession(event.headers.get('Authorization')!)
            }
          }
        })
      )
    }else {
      return next.handle(req);
    }
  }

}
