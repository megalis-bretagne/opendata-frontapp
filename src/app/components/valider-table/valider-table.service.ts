import { Injectable } from '@angular/core';
import { Actes, PieceJointe } from 'src/app/models/publication';

@Injectable()
export class ValiderTableService {

  constructor() { }

  // #region ouverture d'actes et annexes
  openActe(event, acte: Actes | PieceJointe): void {
    event.stopPropagation();
    const href = acte.url
    const link = document.createElement('a'); 
    link.target = '_blank';
    link.href = href;
    link.setAttribute('visibility', 'hidden');
    link.click();
  }
  
  // #endregion

  // #region annexes

  /** Indique si une pièce jointe est publiée 
   * en considérant le paramétrage global de publication d'annexe */
  is_annexe_publiee(pj: PieceJointe, organization_publication_des_annexes: boolean) {
    if (pj.publie == undefined)
      return organization_publication_des_annexes
    return pj.publie;
  }

  // #endregion
}
