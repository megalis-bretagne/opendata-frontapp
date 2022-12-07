import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-en-construction',
  templateUrl: './en-construction.component.html',
  styleUrls: ['./en-construction.component.css']
})
export class EnConstructionComponent implements OnInit {

  @Input()
  text: string = "Cette section est en cours de construction"

  constructor() { }

  ngOnInit(): void {
  }

}
