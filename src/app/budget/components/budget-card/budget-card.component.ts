import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IframeService } from '../../services/iframe.service';
import { VisualisationComponent } from '../visualisations/visualisation.component';

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

  @ContentChild(VisualisationComponent)
  visualisationComponent: VisualisationComponent

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
    // Export comme pdf
    this.genererImageClic.emit();

    let imageDesc = this.visualisationComponent.visualisationDataUrlPourPdf()

    let link = document.createElement('a');
    link.download = 'graphe.png'
    link.href = imageDesc.data_url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  computeIframeFragment(): string {
    return this.iframeService.make_iframe_from_route_path(this.url_consultation)
  }

  private _debug(msg) {
    console.debug(`[BudgetCardComponent] ${msg}`);
  }
}
