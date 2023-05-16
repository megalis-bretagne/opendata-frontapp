import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { select, Store } from '@ngrx/store';
import { GlobalState, selectAuthState } from '../../store/states/global.state';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SettingsService } from '../../../environments/settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';

let mq_actes_themings_vm = [
  { code: null, label: "Défaut" },
  { code: "rouge-rennes", label: "Rouge rennes" },
  { code: "vert-tours", label: "Vert Tours" },
  { code: "turquoise-ille-et-vilaine", label: "Turquoise Ille et Vilaine" },
  { code: "jaune-eurelien", label: "Jaune Eurelien" },
  { code: "orange-orleans", label: "Orange Orleans" },
  { code: "gris-neutre", label: "Gris neutre" },
];

@Component({
  selector: 'app-marque-blanche',
  templateUrl: './marque-blanche.component.html',
  styleUrls: ['./marque-blanche.component.css']
})
export class MarqueBlancheComponent implements OnInit {
  getState: Observable<any>;
  user: User;

  themes_combo = mq_actes_themings_vm;

  theme: string = null;
  siren = null;
  safeObjectUrl?: SafeResourceUrl = null;

  private _url?: string;

  public get url(): string {
    return this._url;
  }
  public set url(value: string) {
    if (value)
      this.safeObjectUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(value)
    this._url = value;
  }

  constructor(
    private snackbar: MatSnackBar,
    private store: Store<GlobalState>, private domSanitizer: DomSanitizer, private settings: SettingsService) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {

    this.store.pipe(select(selectAuthState), take(1)).subscribe((state) => {
      this.user = state.user;
      this.siren = this.user.siren;
    });
  }

  public get htmlStr(): string {

    const urlMarqueBlanche = `${this.settings.settings.urlmarqueblanche}`;

    let siren = this.siren;
    let theme = this.theme;

    let url = `${urlMarqueBlanche}/?siren=${siren}`
    if (this.theme) {
      url += `&theme=${theme}`
    }

    if (url != this.url)
      this.url = url;

    return `
    <iframe 
      referrerpolicy="strict-origin-when-cross-origin" 
      style="border: 0;" 
      src="${url}" 
      title="Marque blanche open data" width="100%" height="600">
    </iframe>
    `;
  }

  ouvre_snackbar(msg: string) {
    this.snackbar.open(msg)
  }
}
