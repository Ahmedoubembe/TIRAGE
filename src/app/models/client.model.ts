export interface Client {
  numero_telephone: string;
  nom: string;
  score: number;
  id_categorie: string;
  prix?: string;
  est_gagnant?: boolean;
  joint?: boolean; // Indique si le client a répondu à l'appel téléphonique
}