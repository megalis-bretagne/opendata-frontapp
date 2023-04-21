import { Injectable } from '@angular/core';
import { PieceJointe } from 'src/app/models/publication';

@Injectable()
export class ValiderTableService {

  constructor() { }
  
  /** Indique si une pièce jointe est publiée 
   * en considérant le paramétrage global de publication d'annexe */
  piece_jointe_publiee(pj: PieceJointe, global_publication_annexe: boolean) {
    if (pj.publie == undefined)
      return global_publication_annexe
    return pj.publie;
  }
}
