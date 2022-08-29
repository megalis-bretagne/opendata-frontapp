import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { zip } from "rxjs"
import { combineLatest, Observable, Subject } from 'rxjs';
import { mergeMap, takeUntil, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Pdc } from '../../models/plan-de-comptes';
import { BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetState, DonneesBudget, selectDonnees, selectBudgetError, selectInformationsPlanDeCompte } from '../../store/states/budget.state';
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

  donneesBudget: DonneesBudget
  informationsPlanDeCompte: Pdc.InformationPdc

  errorInLoadingBudget$;

  private _stop$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<BudgetState>,
    private componentService: BudgetParametrageComponentService) {

    this.user$ = this.componentService.user$;
    this.siren$ = this.componentService.siren$;
    this.errorInLoadingBudget$ = this.store.select(selectBudgetError)
  }

  ngOnInit(): void {

    let navigationParamsObs = combineLatest([
      this.siren$,
      this.componentService.navigation.anneeSelectionnee$,
      this.componentService.navigation.etapeBudgetaireSelectionnee$,
    ])

    navigationParamsObs
      .pipe(
        tap(([siren, annee, etape]) => {
          this.store.dispatch(new BudgetLoadingAction(siren, etape, annee));
        }),

        mergeMap(([siren, annee, etape]) => {
          return zip (
            this.store.select(selectDonnees(siren, annee, etape)),
            this.store.select(selectInformationsPlanDeCompte(siren, annee)),
          );
        }),
        tap(([donnees, informationPdc]) => { 
          this.donneesBudget = donnees 
          this.informationsPlanDeCompte = informationPdc;
        }),
        takeUntil(this._stop$)
      )
      .subscribe()
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
