import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataDialog, Publication} from '../models/models';
import {PublicationResponse} from '../models/publication-response';
import {SettingsService} from '../../environments/settings.service';

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
    const url = `${this.settings.settings.api.url}/api/v1/publication/search`;
    return this.http.post<PublicationResponse> (url, params);
  }

  publish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/api/v1/publication/publier/` + id;
    return this.http.put(url, {});
  }

  delete(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/api/v1/publication/` + id;
    return this.http.delete(url, {});
  }

  modify(element:DataDialog): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/api/v1/publication/modifier/` + element.id;
    return this.http.put(url, {},{ params: { objet:  element.objet }});
  }

  unpublish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/api/v1/publication/depublier/` + id;
    return this.http.put(url, {});
  }

  dontPusblish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/api/v1/publication/masquer/` + id;
    return this.http.put(url, {});
  }

  canPusblish(id: number): Observable<Publication> {
    const url = `${this.settings.settings.api.url}/api/v1/publication/demasquer/` + id;
    return this.http.put(url, {});
  }
}
