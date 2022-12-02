import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisualisationGraphId } from '../../models/visualisation.model';
import { BudgetParametrageComponentService } from '../budget-parametrage/budget-parametrage-component.service';

export interface EditTitreDialogData {
  default_titre: string
  default_description: string
  previous_titre: string
  previous_description: string
  grapheId: VisualisationGraphId
  parametrageService?: BudgetParametrageComponentService
}

export interface _EditTitreFormModel {
  titre?: string,
  description?: string,
}

@Component({
  selector: 'app-edit-titre-dialog',
  templateUrl: './edit-titre-dialog.component.html',
  styleUrls: ['./edit-titre-dialog.component.css']
})
export class EditTitreDialogComponent implements OnInit {

  parametrageService: BudgetParametrageComponentService
  grapheId: VisualisationGraphId
  default_titre: string
  default_descripiton: string
  previous_titre: string
  previous_description: string

  formModel: _EditTitreFormModel = {}

  constructor(@Inject(MAT_DIALOG_DATA) public data: EditTitreDialogData) {

    this.default_titre = data.default_titre
    this.default_descripiton = data.default_description
    this.previous_titre = data.previous_titre
    this.previous_description = data.previous_description
    this.grapheId = data.grapheId
    this.parametrageService = data.parametrageService
  }

  ngOnInit(): void {

    this.formModel.titre = this.previous_titre
    this.formModel.description = this.previous_description
  }

  onSubmit() {
    this.parametrageService.editeGrapheTitres(this.grapheId, this.formModel.titre, this.formModel.description)
  }

}
