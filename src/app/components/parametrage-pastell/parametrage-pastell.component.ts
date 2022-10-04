import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AdminServiceService} from "../../services/admin.service";

@Component({
  selector: 'app-parametrage-pastell',
  templateUrl: './parametrage-pastell.component.html',
  styleUrls: ['./parametrage-pastell.component.css']
})
export class ParametragePastellComponent  {
  result:string

  constructor(private service: AdminServiceService) { }

  postForm(f: NgForm) {
    const id_e = parseInt(f.value.id_e)
    if (isNaN(id_e)) {
      console.log("id_e not entered")
    } else {
      this.service.createParametragePastell({id_e :id_e }).subscribe( result=> {
          this.result =result.statut;
      })
    }
  }
}
