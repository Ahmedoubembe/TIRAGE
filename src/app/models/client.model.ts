export interface Client {
  numero_telephone: string;
  nom: string;
  score: number;
  id_categorie: string;
  prix?: string;
  est_gagnant?: boolean;
  pushed?: boolean;
}