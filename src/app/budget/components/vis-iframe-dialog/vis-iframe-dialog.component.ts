import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IframeDialogData } from '../budget-card/budget-card.component';

@Component({
  selector: 'app-vis-iframe-dialog',
  templateUrl: './vis-iframe-dialog.component.html',
  styleUrls: ['./vis-iframe-dialog.component.css']
})
export class VisIframeDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('iframe_fragment_ref')
  iframe_frag_ref: ElementRef

  constructor(@Inject(MAT_DIALOG_DATA) public data: IframeDialogData) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.iframe_frag_ref.nativeElement
      .innerHTML = this.data?.iframe_fragment
  }

}
