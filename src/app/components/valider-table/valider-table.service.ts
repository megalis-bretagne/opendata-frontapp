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
  piece_jointe_publiee(pj: PieceJointe, global_publication_annexe: boolean) {
    if (pj.publie == undefined)
      return global_publication_annexe
    return pj.publie;
  }

  // #endregion
}
