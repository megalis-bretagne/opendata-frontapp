import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Pdc } from '../../models/plan-de-comptes';
import { extract_siren } from '../../services/siren.functions';
import { BudgetDisponiblesLoadingAction, BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetViewModelSelectors } from '../../store/selectors/BudgetViewModelSelectors';
import { BudgetState, DonneesBudgetaires, selectDonnees as selectDonneesBudget, selectInformationsPlanDeCompte } from '../../store/states/budget.state';

@Component({
  selector: 'app-budget-consultation',
  templateUrl: './budget-consultation.component.html',
  styleUrls: ['./budget-consultation.component.css']
})
export class BudgetConsultationComponent implements OnInit {

  siret
  annee: any;
  etape: any;

  etablissementPrettyname: string;
  donneesBudget: DonneesBudgetaires;
  informationsPdc: Pdc.InformationPdc;

  private _stop$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store<BudgetState>) { }

  ngOnInit(): void {
    this.annee = this.route.snapshot.params['annee'];
    this.siret = this.route.snapshot.params['siret'];
    this.etape = this.route.snapshot.params['etape'];

    let siren = extract_siren(this.siret)

    this.store.dispatch(new BudgetLoadingAction(this.annee, this.siret, this.etape));
    this.store.select(BudgetViewModelSelectors.DonneesDisponibles.etablissementPrettyname(this.siret))
      .pipe(
        tap(prettyName => this.etablissementPrettyname = prettyName),
        takeUntil(this._stop$)
      )
      .subscribe()

    this.store.dispatch(new BudgetDisponiblesLoadingAction(siren));
    this.store.select(selectDonneesBudget(this.annee, this.siret, this.etape))
      .pipe(
        // tap(donnees => console.info(`Donnees ${donnees}`)),
        tap(donnees => this.donneesBudget = donnees),
        takeUntil(this._stop$),
      )
      .subscribe();
    this.store.select(selectInformationsPlanDeCompte(this.annee, this.siret))
      .pipe(
        tap(infoPdc => console.info(`Informations plan de comptes ${infoPdc}`)),
        tap(infoPdc => this.informationsPdc = infoPdc),
        takeUntil(this._stop$),
      )
      .subscribe();

  }

}
