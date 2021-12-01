import { Component, OnInit } from '@angular/core';
import {User} from '../../models/user';
import {select, Store} from '@ngrx/store';
import {GlobalState, selectAuthState} from '../../store/states/global.state';
import {take} from 'rxjs/operators';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {SettingsService} from '../../../environments/settings.service';

@Component({
  selector: 'app-marque-blanche',
  templateUrl: './marque-blanche.component.html',
  styleUrls: ['./marque-blanche.component.css']
})
export class MarqueBlancheComponent implements OnInit {
  getState: Observable<any>;
  user: User;
  htmlStr = '';

  safeObjectUrl?: SafeResourceUrl;

  constructor(private breakpointObserver: BreakpointObserver,
              private store: Store<GlobalState>, private domSanitizer: DomSanitizer, private settings: SettingsService)
  {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {

    const  urlMarqueBlanche = `${this.settings.settings.urlmarqueblanche}`;

    this.store.pipe(select(selectAuthState), take(1)).subscribe((state) => {
      this.user = state.user;
      const url = urlMarqueBlanche + '/?siren=' + this.user.siren;
      this.safeObjectUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(url);

      this.htmlStr = '' +
      '<iframe style="border: 0;" src=' + url +
      ' title="Marque blanche open data" width="100%" height="600">\n' +
      '</iframe>';
    });
  }
}
