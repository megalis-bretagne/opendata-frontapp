import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Publication } from 'src/app/models/publication';
import { MatTableModule } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PublicationPjsCommands, PublicationPjsPayload, PublicationsService } from 'src/app/services/publications-service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface GestionPublicationAnexesDialogComponent_DialogData {
  publication: Publication
}

@Component({
  selector: 'app-gestion-publication-anexes',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule, MatTableModule, MatButtonModule,
    MatProgressBarModule, MatIconModule, MatProgressSpinnerModule,
    FormsModule, ReactiveFormsModule
  ],
  templateUrl: './gestion-publication-anexes.component.html',
  styleUrls: ['./gestion-publication-annexes.component.scss']
})
export class GestionPublicationAnexesDialogComponent {

  public form: FormGroup;

  private _publication: Publication;
  public get publication(): Publication { return this._publication; }
  public set publication(v: Publication) {
    this._publication = v;
    this.form = this._make_form(v);
  }

  displayedColumns = ['nom', 'etat']

  /** Mise à jour du status des pièces jointes en cours*/
  pending = false;
  /** Erreur de la dernière requête de mise à jours des pjs*/
  last_request_error = null;
  last_request_success = false;

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationsService,
    public dialogRef: MatDialogRef<GestionPublicationAnexesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GestionPublicationAnexesDialogComponent_DialogData,
  ) {
    this.publication = data.publication;
    this.dialogRef.beforeClosed().subscribe(_ => this.onClose())
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

  private _make_form(value: Publication): FormGroup<any> {
    let controls = {}

    for (const pj of value.pieces_jointe) {
      let control = this.fb.control(pj.publie);
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

