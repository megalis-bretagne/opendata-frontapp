import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IframeService } from '../../services/iframe.service';
import { VisualisationComponent } from '../visualisations/visualisation.component';
import { MatDialog } from '@angular/material/dialog';
import { VisIframeDialogComponent } from '../vis-iframe-dialog/vis-iframe-dialog.component';

export interface DialogData {
  iframe_fragment: string
}

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
    private dialog: MatDialog,
    private iframeService: IframeService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._stop$.next(null);
  }

  onDeplacerClic() {
    this.deplacerClic.emit();
  }
  onEditeClic() {
    this.editeClic.emit();
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

  visualizeIframeThroughDialog() {
    let fragment = this.computeIframeFragment()
    const dialogRef = this.dialog.open(VisIframeDialogComponent, {
      data: {
        iframe_fragment: fragment
      } as DialogData
    });
  }

  private _debug(msg) {
    console.debug(`[BudgetCardComponent] ${msg}`);
  }
}
