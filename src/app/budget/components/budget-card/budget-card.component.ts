import { Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IframeService } from '../../services/iframe.service';
import { VisualisationComponent } from '../visualisations/visualisation.component';
import { MatDialog } from '@angular/material/dialog';
import { VisIframeDialogComponent } from '../vis-iframe-dialog/vis-iframe-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { snackify, snackify_telechargement } from '../budget-utils';

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
    private snackBar: MatSnackBar,
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
    this.genererImageClic.emit();

    let nom_fichier = 'graphe.png'

    snackify_telechargement(
      () => this._export_as_png(nom_fichier),
      this.snackBar,
      nom_fichier
    )
  }

  _export_as_png(nom_fichier: string) {

    let imageDesc = this.visualisationComponent.visualisationDataUrlPourPdf()

    let link = document.createElement('a');
    link.download = nom_fichier
    link.href = imageDesc.data_url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  ouvre_snackbar(msg: string) {
    this.snackBar.open(msg)
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
