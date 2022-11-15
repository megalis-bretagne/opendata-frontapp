import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IframeService } from '../../services/iframe.service';
import { BudgetsStoresService } from '../../services/budgets-store.service';

@Component({
  selector: 'app-budget-card',
  templateUrl: './budget-card.component.html',
  styleUrls: ['./budget-card.component.css']
})
export class BudgetCardComponent implements OnInit, OnDestroy {

  @Input()
  parametrable = false;

  @Input()
  url_consultation = ''

  @Input()
  titre?;

  @Input()
  description?: string;

  @Output()
  deplacerClic = new EventEmitter();
  @Output()
  editeClic = new EventEmitter();
  @Output()
  copierIframeClic = new EventEmitter();
  @Output()
  genererImageClic = new EventEmitter();

  _stop$ = new Subject();

  get isLoading() {
    return !Boolean(this.titre) && !Boolean(this.description)
  }

  constructor(
    private iframeService: IframeService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._stop$.next(null);
  }

  onNavClic() {
    let url = this.url_consultation
    this.router.navigateByUrl(url)
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

  computeIframeFragment(): string {
    return this.iframeService.make_iframe_from_route_path(this.url_consultation)
  }

  private _debug(_) {
    // console.debug(`[BudgetCardComponent] ${msg}`);
  }
}
