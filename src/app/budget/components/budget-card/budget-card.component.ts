import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {tap, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BudgetState, selectBudgetError, selectBudgetIsLoading } from '../../store/states/budget.state';

@Component({
  selector: 'app-budget-card',
  templateUrl: './budget-card.component.html',
  styleUrls: ['./budget-card.component.css']
})
export class BudgetCardComponent implements OnInit, OnDestroy {

  @Input()
  parametrable = false;

  @Input()
  titre = 'Titre';

  @Input()
  description = 'Description';

  @Output()
  deplacerClic = new EventEmitter();
  @Output()
  editeClic = new EventEmitter();
  @Output()
  copierIframeClic = new EventEmitter();
  @Output()
  genererImageClic = new EventEmitter();


  isLoading: boolean = true;
  hasError = false;
  isSuccess = () => !this.isLoading && !this.hasError;

  _stop$ = new Subject();

  constructor(private store: Store<BudgetState>) { }

  ngOnInit(): void {
    this.store.select(selectBudgetError)
      .pipe(
        tap(hasError => this.hasError = hasError),
        takeUntil(this._stop$)
      ).subscribe()
    this.store.select(selectBudgetIsLoading)
      .pipe(
        tap(isLoading => this.isLoading = isLoading),
        takeUntil(this._stop$)
      ).subscribe()
  }

  ngOnDestroy(): void {
      this._stop$.next(null);
  }

  onDeplacerClic() {
    this.deplacerClic.emit();
  }
  onEditeClic() {
    this.editeClic.emit();
  }
  onIframeClic() {
    this.copierIframeClic.emit();
  }
  onExportClic() {
    this.genererImageClic.emit();
  }

  private _debug(msg) {
    console.debug(`[BudgetCardComponent] ${msg}`);
  }
}
