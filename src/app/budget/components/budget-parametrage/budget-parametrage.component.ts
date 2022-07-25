import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetState } from '../../store/states/budget.state';
import { BudgetParametrageComponentService } from './budget-parametrage-component.service';

@Component({
  selector: 'app-budget-parametrage',
  templateUrl: './budget-parametrage.component.html',
  styleUrls: ['./budget-parametrage.component.css'],
  providers: [BudgetParametrageComponentService],
})
export class BudgetParametrageComponent implements OnInit, OnDestroy {

  user$: Observable<User>;
  siren$: Observable<string>;

  private _stop$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<BudgetState>,
    private componentService: BudgetParametrageComponentService) {

    this.user$ = this.componentService.user$;
    this.siren$ = this.componentService.siren$;
  }

  ngOnInit(): void {
    
    combineLatest([this.siren$, this.componentService.navigation.anneeSelectionnee$])
      .pipe(
        tap(([siren, annee]) => this.store.dispatch(new BudgetLoadingAction(siren, annee))),
        takeUntil(this._stop$)
      ) .subscribe()
  }

  onEnregistrerClic() {
    // TODO: impl
  }

  onTelechargerPdfClic() {
    // TODO impl
  }

  onCopierIframeClic() {
    // TODO impl
  }

  ngOnDestroy(): void {
    this._stop$.next();
    this._stop$.complete();
  }
}
