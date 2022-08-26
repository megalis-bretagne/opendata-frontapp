import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { BudgetLoadingAction } from '../../store/actions/budget.actions';
import { BudgetState, selectDonnees as selectDonneesBudget } from '../../store/states/budget.state';

@Component({
  selector: 'app-budget-consultation',
  templateUrl: './budget-consultation.component.html',
  styleUrls: ['./budget-consultation.component.css']
})
export class BudgetConsultationComponent implements OnInit {

  siren
  etape: any;
  annee: any;

  donneesBudget;

  private _stop$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private store: Store<BudgetState>) { }

  ngOnInit(): void {
     this.siren = this.route.snapshot.params['siren'];
     this.etape = this.route.snapshot.params['etape'];
     this.annee = this.route.snapshot.params['annee'];

     this.store.dispatch(new BudgetLoadingAction(this.siren, this.etape, this.annee));
     this.store.select(selectDonneesBudget(this.siren, this.annee, this.etape))
        .pipe(
            tap(donnees => console.info(`Donnees ${donnees}`)),
            tap(donnees => this.donneesBudget = donnees),
            takeUntil(this._stop$),
        )
        .subscribe();
  }
  
}
