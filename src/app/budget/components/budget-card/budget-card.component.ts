import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-budget-card',
  templateUrl: './budget-card.component.html',
  styleUrls: ['./budget-card.component.css']
})
export class BudgetCardComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
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
