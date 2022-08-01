import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { BudgetParametrageComponentService } from './budget-parametrage-component.service';

@Component({
  selector: 'app-budget-parametrage',
  templateUrl: './budget-parametrage.component.html',
  styleUrls: ['./budget-parametrage.component.css'],
  providers: [BudgetParametrageComponentService],
})
export class BudgetParametrageComponent implements OnDestroy {

  user$: Observable<User>;
  siren$: Observable<string>;

  private _stop$: Subject<void> = new Subject<void>();

  constructor(
    private componentService: BudgetParametrageComponentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.user$ = this.componentService.user$;
    this.siren$ = this.componentService.siren$;
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }
}
