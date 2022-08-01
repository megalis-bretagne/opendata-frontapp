import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { GlobalState, selectAuthState } from 'src/app/store/states/global.state';

@Component({
  selector: 'app-budget-parametrage',
  templateUrl: './budget-parametrage.component.html',
  styleUrls: ['./budget-parametrage.component.css']
})
export class BudgetParametrageComponent implements OnInit {

  user$: Observable<User>;

  constructor(private store: Store<GlobalState>) {
    this.user$ = this.store.select(selectAuthState)
      .pipe(
        map((state) => state.user)
      )
  }

  ngOnInit(): void {
  }
}
