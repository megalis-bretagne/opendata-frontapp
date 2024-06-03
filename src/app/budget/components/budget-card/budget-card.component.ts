import { Component, ContentChild, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { IframeService } from '../../services/iframe.service';
import { VisualisationComponent } from '../visualisations/visualisation.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { VisIframeDialogComponent } from '../vis-iframe-dialog/vis-iframe-dialog.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { snackify_telechargement } from '../budget-utils';
import { EditTitreDialogComponent, EditTitreDialogData } from '../edit-titre-dialog/edit-titre-dialog.component';
import { BudgetParametrageComponentService } from '../budget-parametrage/budget-parametrage-component.service';
import { Visualisation } from '../../models/visualisation.model';
import { BudgetCardComponentService, VisualisationComponentService } from './budget-card-component.service';

export interface IframeDialogData {
  iframe_fragment: string
}

@Component({
  selector: 'app-budget-card',
  templateUrl: './budget-card.component.html',
  styleUrls: ['./budget-card.component.css'],
  providers: [
    { provide: VisualisationComponentService, useClass: BudgetCardComponentService }
  ]
})
export class BudgetCardComponent implements OnInit, OnDestroy {

  get titre() {
    return this.service.titre
  }
  get description() {
    return this.service.description
  }
  get graphe_id() {
    return this.service.graphe_id
  }

  get parametrable() {
    return Boolean(this.parametrageComponentService)
  }

  get url_consultation() {
    return this.service.url_consultation
  }

  get is_loading$() {
    return this.service.is_loading$
  }

  get is_in_error$() {
    return this.service.is_in_error$
  }

  get is_loading_unless_in_eror$() {
    return this.service.is_loading_unless_in_error$
  }

  get is_successfully_loaded$() {
    return this.service.is_successfully_loaded$
  }

  @Input()
  set visualisation(visualisation: Visualisation) {
    this.service.visualisation = visualisation
  }

  _stop$ = new Subject();

  @ContentChild(VisualisationComponent)
  visualisationComponent: VisualisationComponent

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private iframeService: IframeService,
    private service: VisualisationComponentService,
    @Optional()
    private parametrageComponentService?: BudgetParametrageComponentService,
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._stop$.next(null);
  }

  onDeplacerClic() { }

  onEditeClic() {
    const dialogRef = this.dialog.open(EditTitreDialogComponent, {
      data: {
        default_titre: this.service.default_titre,
        default_description: this.service.default_description,
        previous_titre: this.titre,
        previous_description: this.description,
        grapheId: this.graphe_id,
        parametrageService: this.parametrageComponentService,
      } as EditTitreDialogData,
      minWidth: '50%',
    });
  }

  onExportClic() {
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
      } as IframeDialogData
    });
  }

  private _debug(msg) {
    console.debug(`[BudgetCardComponent] ${msg}`);
  }
}
