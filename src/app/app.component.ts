import { Component , OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LogIn } from './store/actions/auth.actions';
import {GlobalState} from './store/states/global.state';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'opendata-app';

  constructor(private store: Store<GlobalState>)
  {}

  ngOnInit(): void {
    this.store.dispatch(new LogIn());
  }

}
