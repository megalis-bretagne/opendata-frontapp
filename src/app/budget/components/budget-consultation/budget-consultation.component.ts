import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Pdc } from '../../models/plan-de-comptes';
import { BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetState, DonneesBudgetaires, selectDonnees as selectDonneesBudget, selectInformationsPlanDeCompte } from '../../store/states/budget.state';

@Component({
  selector: 'app-budget-consultation',
  templateUrl: './budget-consultation.component.html',
  styleUrls: ['./budget-consultation.component.css']
})
export class BudgetConsultationComponent implements OnInit {

  siren
  etape: any;
  annee: any;

  donneesBudget: DonneesBudgetaires;
  informationsPdc: Pdc.InformationPdc;

  private _stop$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store<BudgetState>) { }

  ngOnInit(): void {
     this.siren = this.route.snapshot.params['siren'];
     this.etape = this.route.snapshot.params['etape'];
     this.annee = this.route.snapshot.params['annee'];

     this.store.dispatch(new BudgetLoadingAction(this.siren, this.annee, this.etape));
     this.store.select(selectDonneesBudget(this.siren, this.annee, this.etape))
        .pipe(
            // tap(donnees => console.info(`Donnees ${donnees}`)),
            tap(donnees => this.donneesBudget = donnees),
            takeUntil(this._stop$),
        )
        .subscribe();

      this.store.select(selectInformationsPlanDeCompte(this.siren, this.annee))
        .pipe(
            tap(infoPdc => console.info(`Informations plan de comptes ${infoPdc}`)),
            tap(infoPdc => this.informationsPdc = infoPdc),
            takeUntil(this._stop$),
        )
        .subscribe();

  }
  
}
