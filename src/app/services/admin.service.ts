import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {SettingsService} from '../../environments/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AdminServiceService {

  private BASE_URL = '';

  constructor(
    private http: HttpClient,
    private settings: SettingsService
  ) {
  }
  createGEDSftp(body): Observable<any> {
    const url = `${this.settings.settings.api.url}/api/v1/admin/pastell/creation/ged_sftp-opendata`;
    return this.http.post<any>(url,body);
  }

  createGEDPastell(body): Observable<any> {
    const url = `${this.settings.settings.api.url}/api/v1/admin/pastell/creation/ged-megalis-opendata`
    return this.http.post<any>(url, body);
  }

}
