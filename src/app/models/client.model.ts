export interface Client {
  nom: string;
  prenom: string;
  numero_telephone: string;
  id_categorie: string;
  prix: string;
  est_gagnant?: boolean;
}