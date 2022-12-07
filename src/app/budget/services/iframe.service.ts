import { Location } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IframeService {

  constructor(private location: Location) { }

  /** Takes a route path and transforms it in iframe */
  make_iframe_from_route_path(route_path: string) {
    let prepared = this.location.prepareExternalUrl(route_path)
    let url = new URL(prepared, location.origin)
    return `
      <iframe 
        referrerpolicy="strict-origin-when-cross-origin" 
        style="border: 0;" 
        src="${url.href}" 
        title="Marque blanche budgets" 
        width="100%" height="600"
      >
      </iframe>
    `
  }
}
