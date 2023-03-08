import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataDialog, Publication} from '../models/models';
import {PublicationResponse} from '../models/publication-response';
import {SettingsService} from '../../environments/settings.service';

/** Structure d'une commande publicaion / depublication d'une pièce jointe.
 * Consiste en l'id de la PJ associée à true pour une commande publication et false pour une commande de dépublication
 * */
export interface PublicationPjPayload {
  [id: string]: boolean
}

@Injectable({
  providedIn: 'root',
})
export class PublicationsService {


  constructor(
    private http: HttpClient,
    private settings: SettingsService
  ) {
  }
  searchPublications(params): Observable<PublicationResponse> {
    const url = `${this.settings.settings.api.url}/private_api/v1/publication/search`;
    return this.http.post<PublicationResponse> (url, params);
  }

  publish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/private_api/v1/publication/publier/` + id;
    return this.http.put<Publication>(url, {});
  }

  delete(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/private_api/v1/publication/` + id;
    return this.http.delete<Publication>(url, {});
  }

  modify(element:DataDialog): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/private_api/v1/publication/modifier/` + element.id;
    return this.http.put<Publication>(url, {},{ params: { objet:  element.objet }});
  }

  unpublish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/private_api/v1/publication/depublier/` + id;
    return this.http.put<Publication>(url, {});
  }

  dontPusblish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/private_api/v1/publication/masquer/` + id;
    return this.http.put<Publication>(url, {});
  }

  canPusblish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/private_api/v1/publication/demasquer/` + id;
    return this.http.put<Publication>(url, {});
  }

  // #region piece jointe
  publish_pj(payload: PublicationPjPayload) {
    const url = `${this._url}/pieces_jointes/`
    return this.http.post(url, payload);
  }
  // #endregion

  get _url() {
    return `${this.settings.settings.api.url}/private_api/v1/publication`
  }
}
