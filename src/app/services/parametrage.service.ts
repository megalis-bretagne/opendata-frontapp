import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Parametrage} from '../models/models';
import {SettingsService} from '../../environments/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ParametrageService {

  private BASE_URL = '';

  constructor(
    private http: HttpClient,
    private settings: SettingsService
  ) {
  }
  getParametrage(siren): Observable<Parametrage> {
    const url = `${this.settings.settings.api.url}/api/v1/parametrage/` + siren;
    return this.http.get<Parametrage>(url);
  }

  updateParametrage(parametrage): Observable<Parametrage> {
    const url = `${this.settings.settings.api.url}/api/v1/parametrage/` + parametrage.siren;
    return this.http.post<Parametrage>(url, parametrage);
  }

}
