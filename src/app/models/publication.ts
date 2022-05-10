export interface Publication {
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
  id?: number;
  url?: string;
  name?: string;
  publication_id?: string;
}
