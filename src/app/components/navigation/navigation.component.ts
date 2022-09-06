import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {LogOut} from '../../store/actions/auth.actions';
import {GlobalState, selectAuthState} from '../../store/states/global.state';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  getState: Observable<any>;
  page = 'accueil';
  user = null;
  jeton = '';

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private breakpointObserver: BreakpointObserver,
              private store: Store<GlobalState>, private authService: AuthService)
  {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    this.getState.subscribe((state) => {
      this.user = state.user;
    });
    this.authService.getToken().then(value =>
      this.jeton = 'Bearer ' + value
    );

  }
  logout(): void{
    this.store.dispatch(new LogOut());
  }

  has_role(): boolean{
    return (this.is_admin_open_data() || this.is_superAdmin() || this.is_Admin());
}

  is_admin_open_data(): boolean{
    if ( this.user === null) {
      return false;
    }
    return  this.user.role === 'admin_opendata';
  }

  is_Admin(): boolean{
    if ( this.user === null) {
      return false;
    }
    return  this.user.userType === 'ADMIN';
  }

  // TODO gérer le user super admin ne fonctionne pas actuellement
  is_superAdmin(): boolean{
    if ( this.user === null) {
      return false;
    }
    return  this.user.userType === 'ROLE_SUPER_ADMIN';
  }

}
