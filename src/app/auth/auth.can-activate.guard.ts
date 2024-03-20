import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {map, take} from "rxjs/operators";

export const authCanActivateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.user.pipe(
    take(1),
    map(user => {
      const isAuth = !!user;
      if (isAuth) {
        return true;
      } else {
        return router.createUrlTree(['/auth']);
      }
    }));
};
