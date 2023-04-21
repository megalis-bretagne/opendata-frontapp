export interface Publication {
  id: number;
  numero_de_lacte: string;
  objet: string;
  siren: string;
  publication_open_data: string;
  date_de_lacte: Date;
  classification_code: string;
  classification_nom: string;
  acte_nature: string;
  actes: Actes[];
  pieces_jointe: PieceJointe[];

  est_publie?: boolean;
  est_masque?: boolean;

  etat: string;
}

export interface DataDialog {
  id?: number;
  acte_nature?: string;
  classification_code?: string;
  classification_nom?: string;
  est_publie?: boolean;
  est_masque?: boolean;
  numero_de_lacte?: string;
  objet?: string;
  publication_open_data?: string;
  date_de_lacte?: Date;
  siren?: string;
  actes?: Actes[];
  action?: string;
  title?: string;
}

export interface Actes {
  id: number;
  publication_id: number;
  url: string;
  name: string;
}

export interface PieceJointe extends Actes {
  publie?: boolean;
}
