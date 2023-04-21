import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieceJointe, Publication } from 'src/app/models/publication';
import { MatTableModule } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, _MatDialogBase } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PublicationPjsPayload, PublicationsService } from 'src/app/services/publications-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValiderTableService } from '../valider-table.service';

export interface GestionPublicationAnnexesDialogComponent_DialogData {
  publication: Publication,
  organization_publication_des_annexes: boolean,
  valider_table_service: ValiderTableService,
}

@Component({
  selector: 'app-gestion-publication-annexes',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule, MatTableModule, MatButtonModule,
    MatProgressBarModule, MatIconModule, MatProgressSpinnerModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './gestion-publication-annexes.component.html',
  styleUrls: ['./gestion-publication-annexes.component.scss']
})
export class GestionPublicationAnnexesDialogComponent {
  private fb = inject(FormBuilder);
  private publicationService = inject(PublicationsService);
  private component_service: ValiderTableService;

  public form: FormGroup;

  private _publication: Publication;
  public get publication(): Publication { return this._publication; }
  private _organization_publication_des_annexes: boolean;
  public get organization_publication_des_annexes(): boolean { return this._organization_publication_des_annexes; }

  displayedColumns = ['nom', 'consulter','etat']

  /** Mise à jour du status des pièces jointes en cours*/
  pending = false;
  /** Erreur de la dernière requête de mise à jours des pjs*/
  last_request_error = null;
  last_request_success = false;

  constructor(
    public dialogRef: MatDialogRef<GestionPublicationAnnexesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: GestionPublicationAnnexesDialogComponent_DialogData,
  ) {
    this._publication = data.publication;
    this._organization_publication_des_annexes = data.organization_publication_des_annexes;
    this.component_service = data.valider_table_service;
    this.form = this._make_form();
    this.dialogRef.beforeClosed().subscribe(_ => this.onClose())
  }

  open_annexe(event, pj: PieceJointe) {
    return this.component_service.openActe(event, pj);
  }

  onSubmit() {
    let payload = this._form_to_publish_pj_payload()

    this._publish_pj_init();
    this.publicationService
      .publish_pj(payload)
      .pipe(finalize(this._publish_pj_finally.bind(this)))
      .subscribe(
        {
          next: this._publish_pj_success.bind(this),
          error: this._publish_pj_error.bind(this),
        }
      )
  }

  onClose() {
    this.dialogRef.close()
  }

  private _publish_pj_init() {
    this.pending = true;
    this.last_request_success = false;
    this.last_request_error = null;
    this.dialogRef.disableClose = true;
  }
  private _publish_pj_success() {
    this.last_request_error = null;
    this.last_request_success = true;
    this.form.markAsPristine();
  }
  private _publish_pj_error(err) {
    this.last_request_success = false;
    this.last_request_error = err;
  }
  private _publish_pj_finally() {
    this.pending = false;
    this.dialogRef.disableClose = false;
  }

  private _make_form(): FormGroup<any> {
    let publication: Publication = this.publication;
    let organization_publication_des_annexes = this.organization_publication_des_annexes;
    let controls = {}

    for (const pj of publication.pieces_jointe) {
      let control = this.fb.control(this.component_service.is_annexe_publiee(pj, organization_publication_des_annexes));
      controls[pj.id] = control;
    }

    return this.fb.group(controls);
  }

  private _form_to_publish_pj_payload(): PublicationPjsPayload {

    let commands_pjs_publication = { }

    for (const id of Object.keys(this.form.controls)) {
      let control = this.form.controls[id];
      if (!control.dirty)
        continue;

      commands_pjs_publication[id] = control.value;
    }

    let payload = {}
    payload[this.publication.id] = commands_pjs_publication;

    return payload
  }
}

